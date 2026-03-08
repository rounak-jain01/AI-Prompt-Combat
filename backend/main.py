import os
import json
import requests
from datetime import datetime
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, firestore, auth

# --- FIREBASE INIT ---
if not firebase_admin._apps:
    cred_json = os.getenv("FIREBASE_CREDENTIALS")
    if cred_json:
        cred = credentials.Certificate(json.loads(cred_json))
    elif os.path.exists("serviceAccountKey.json"):
        cred = credentials.Certificate("serviceAccountKey.json")
    else:
        cred = None
    
    if cred:
        firebase_admin.initialize_app(cred)

db = firestore.client() if firebase_admin._apps else None
# Performance Optimization: Global session for connection pooling
session = requests.Session()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELS ---
class EvaluateRequest(BaseModel):
    prompt: str
    pairId: int

class RoundSubmissionRequest(BaseModel):
    averageScore: float
    totalPairs: int
    breakdown: list
    username: str = "Unknown"
    isCheating: bool = False

class StartRoundRequest(BaseModel):
    roundId: str

class ResetUserRequest(BaseModel):
    targetUserId: str

class Round2Submission(BaseModel):
    videoUrl: str
    prompt: str

class AddUserModel(BaseModel):
    email: str
    fullName: str
    role: str = "student"

# --- CONSTANTS ---
TARGET_PROMPTS = {
    1: "Solarpunk architecture with vertical gardens...",
    2: "Surreal portrait made of bioluminescent blue liquid...",
    3: "Massive steampunk space station shaped like a gear...",
    4: "Liminal space horror playground, foggy...",
    5: "Intricate 3D paper quilling art of a lion..."
}

# --- DEPENDENCIES ---
def verify_token(authorization: str = Header(...)):
    try:
        token = authorization.split("Bearer ")[1]
        decoded = auth.verify_id_token(token)
        return decoded['uid']
    except:
        raise HTTPException(status_code=401, detail="Invalid Token")

def verify_admin(uid: str = Depends(verify_token)):
    user = db.collection("users").document(uid).get()
    if not user.exists or user.to_dict().get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admins Only")
    return uid

# --- ROUTES ---

@app.get("/")
def health():
    return {"status": "online"}

@app.post("/api/start-round")
def start_round(req: StartRoundRequest, uid: str = Depends(verify_token)):
    ref = db.collection("users").document(uid)
    doc = ref.get()
    if doc.exists and doc.to_dict().get(f"{req.roundId}_status") == "submitted":
        return {"success": False, "message": "Already submitted"}
    
    ref.update({
        f"{req.roundId}_status": "started",
        f"{req.roundId}_startTime": firestore.SERVER_TIMESTAMP
    })
    return {"success": True}

@app.post("/api/evaluate")
def evaluate_prompt(req: EvaluateRequest):
    url = "https://rounakjain01-kaggle-koders-ai.hf.space/calculate"
    payload = {"prompt": req.prompt, "target": TARGET_PROMPTS.get(req.pairId, "")}
    
    try:
        # Timeout 45 seconds kiya hai taaki agar HF model sleep par ho, toh usko jaagne ka time mile
        res = session.post(url, json=payload, timeout=45)
        
        if res.status_code == 200:
            data = res.json()
            # Dhyan rahe ki frontend ko feedback array aur score proper format mein mile
            return {
                "success": True, 
                "score": data.get("score", 0), 
                "feedback": data.get("feedback", [])
            }
        else:
            # Agar Hugging Face ne 500, 503 ya 404 error diya toh terminal mein print hoga
            print(f"HF Error Status: {res.status_code}, Response: {res.text}")
            return {"success": False, "score": 0, "message": f"AI Engine Error ({res.status_code}). Server might be asleep."}
            
    except Exception as e:
        # Asli bimari yahan print hogi (e.g., requests.exceptions.Timeout)
        print(f"Evaluate Endpoint Failed: {str(e)}")
        return {"success": False, "score": 0, "message": "AI is waking up or overloaded. Please try again in 30 seconds."}
@app.post("/api/submit-round")
def submit_round1(req: RoundSubmissionRequest, uid: str = Depends(verify_token)):
    try:
        user_ref = db.collection("users").document(uid)
        user_data = user_ref.get().to_dict() or {}
        name = user_data.get("fullName") or "Anonymous"
        status = "disqualified" if req.isCheating else "submitted"

        # Optimization: Use Batch for multiple collection updates
        batch = db.batch()
        batch.update(user_ref, {
            "round1_status": status,
            "round1_score": req.averageScore,
            "round1_endTime": firestore.SERVER_TIMESTAMP,
            "isFlagged": req.isCheating 
        })
        
        lead_ref = db.collection("leaderboard").document(uid)
        batch.set(lead_ref, {
            **req.dict(),
            "userId": uid,
            "username": name,
            "timestamp": firestore.SERVER_TIMESTAMP,
            "status": "valid" if not req.isCheating else "disqualified"
        })
        batch.commit()
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/round2/submit")
def submit_round2(req: Round2Submission, uid: str = Depends(verify_token)):
    ref = db.collection("users").document(uid)
    if not ref.get().exists:
        raise HTTPException(status_code=404, detail="User not found")
    
    ref.update({
        "round2_status": "submitted",
        "round2_video_link": req.videoUrl,
        "round2_prompt": req.prompt,
        "round2_submitted_at": firestore.SERVER_TIMESTAMP
    })
    return {"success": True}

@app.get("/api/user-status")
def get_status(uid: str = Depends(verify_token)):
    doc = db.collection("users").document(uid).get()
    if not doc.exists: return {"success": False}
    data = doc.to_dict()
    return {
        "success": True,
        "round1_status": data.get("round1_status", "pending"),
        "round2_status": data.get("round2_status", "pending")
    }

# --- ADMIN ROUTES ---

@app.get("/api/admin/stats")
def get_stats(_: str = Depends(verify_admin)):
    users = db.collection("users").stream()
    stats = {"total": 0, "r1_sub": 0, "r2_sub": 0, "flagged": 0}
    for u in users:
        d = u.to_dict()
        stats["total"] += 1
        if d.get("round1_status") == "submitted": stats["r1_sub"] += 1
        if d.get("round2_status") == "submitted": stats["r2_sub"] += 1
        if d.get("isFlagged"): stats["flagged"] += 1
    return {"success": True, "stats": stats}

@app.post("/api/admin/reset-user")
def reset_user(req: ResetUserRequest, _: str = Depends(verify_admin)):
    # Optimization: Atomic deletion/update using Batch
    batch = db.batch()
    u_ref = db.collection("users").document(req.targetUserId)
    batch.update(u_ref, {
        "round1_status": "pending", "round1_score": 0, "round2_status": "pending",
        "isFlagged": False, "round2_video_link": firestore.DELETE_FIELD,
        "round1_startTime": firestore.DELETE_FIELD, "round2_submitted_at": firestore.DELETE_FIELD
    })
    batch.delete(db.collection("leaderboard").document(req.targetUserId))
    batch.commit()
    return {"success": True}

@app.post("/api/admin/add-user")
def add_user(data: AddUserModel, _: str = Depends(verify_admin)):
    try:
        new_auth = auth.create_user(email=data.email, display_name=data.fullName, email_verified=True)
        db.collection("users").document(new_auth.uid).set({
            **data.dict(), "round1_status": "pending", "round2_status": "pending",
            "createdAt": firestore.SERVER_TIMESTAMP
        })
        return {"success": True, "inviteLink": auth.generate_password_reset_link(data.email)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/api/admin/delete-user/{target_uid}")
def delete_user(target_uid: str, _: str = Depends(verify_admin)):
    batch = db.batch()
    batch.delete(db.collection("users").document(target_uid))
    batch.delete(db.collection("leaderboard").document(target_uid))
    try: auth.delete_user(target_uid)
    except: pass
    batch.commit()
    return {"success": True}