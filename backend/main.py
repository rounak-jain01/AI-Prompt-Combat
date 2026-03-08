import os
import json
import requests
from datetime import datetime
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, firestore, auth
from sentence_transformers import SentenceTransformer, util

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
print("Loading Sentence Transformer Model...")
ai_model = SentenceTransformer('all-MiniLM-L6-v2')
print("Model Loaded Successfully!")
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
    target_prompt = TARGET_PROMPTS.get(req.pairId, "")
    
    if not target_prompt:
        return {"success": False, "score": 0, "message": "Invalid Target Pair ID"}
        
    try:
        # User aur Target prompt ko AI embeddings (numbers) mein convert karein
        embedding_user = ai_model.encode(req.prompt, convert_to_tensor=True)
        embedding_target = ai_model.encode(target_prompt, convert_to_tensor=True)
        
        # Dono ke beech ka match (Cosine Similarity) nikalein
        cosine_score = util.cos_sim(embedding_user, embedding_target).item()
        
        # Score ko 0-100 percentage mein convert karein
        final_score = max(0, min(100, int(cosine_score * 100)))
        
        # Feedback generate karein
        feedback = []
        if final_score >= 85:
            feedback.append("Excellent match! Your prompt is highly accurate.")
        elif final_score >= 60:
            feedback.append("Good attempt, but missing some specific details.")
            feedback.append("Try to add more descriptive keywords.")
        else:
            feedback.append("Low accuracy. The AI could not find the core subjects.")
            feedback.append("Focus on the main elements and art style of the image.")

        return {
            "success": True, 
            "score": final_score, 
            "feedback": feedback
        }
        
    except Exception as e:
        print(f"AI Evaluation Error: {str(e)}")
        return {"success": False, "score": 0, "message": "Internal AI Processing Error"}


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