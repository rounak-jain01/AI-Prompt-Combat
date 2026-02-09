import os
import json
from datetime import datetime
import requests  # ✅ Added for HF Space call
from fastapi import FastAPI, HTTPException, Header, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- FIREBASE IMPORTS ---
import firebase_admin
from firebase_admin import credentials, firestore, auth

# 1. Initialize Firebase (Smart Logic for Local vs Render)
if not firebase_admin._apps:
    firebase_creds_json = os.getenv("FIREBASE_CREDENTIALS")
    
    if firebase_creds_json:
        # PRODUCTION (Render)
        cred_dict = json.loads(firebase_creds_json)
        cred = credentials.Certificate(cred_dict)
        print("✅ Firebase Loaded from Environment Variable")
    else:
        # LOCAL
        if os.path.exists("serviceAccountKey.json"):
            cred = credentials.Certificate("serviceAccountKey.json")
            print("✅ Firebase Loaded from Local File")
        else:
            # Fallback
            print("⚠️ Warning: serviceAccountKey.json not found.")
            cred = None

    if cred:
        firebase_admin.initialize_app(cred)

# Database Client
db = firestore.client() if firebase_admin._apps else None

# Init App
app = FastAPI()

# 2. Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (localhost, render, etc.)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# ❌ REMOVED: Heavy Model Loading (Render will be happy now)
# print("🤖 Loading AI Judge Model...")
# model = SentenceTransformer('all-MiniLM-L6-v2') 
# print("✅ AI Judge Ready!")

# --- DATA MODELS ---

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

# --- CONSTANTS ---
TARGET_PROMPTS = {
    1: "Solarpunk architecture with vertical gardens, lush greenery covering concrete, cascading waterfalls, futuristic sustainable design, bright sunlight, utopian atmosphere, organic shapes, high detail.",
    2: "Surreal portrait made of bioluminescent blue liquid water, fluid form with splashing effects, translucent texture, glowing particles, ethereal fantasy style, dark background, magical atmosphere.",
    3: "Massive steampunk space station shaped like a gear orbiting a planet, industrial sci-fi architecture, metallic details, cosmic background with stars, cinematic scale, intricate machinery.",
    4: "Liminal space horror playground, foggy and abandoned atmosphere, rusted metal, muted desaturated colors, eerie lighting, unsettling vibe, haunted aesthetic.",
    5: "Intricate 3D paper quilling art of a lion, layered paper strips with depth, vibrant colors, handmade craft texture, papercraft style, abstract artistic representation."
}

# --- HELPER FUNCTIONS ---

def verify_token(authorization: str = Header(...)):
    """
    Extracts the Bearer Token from the header and verifies it with Firebase Auth.
    Returns the User UID if valid.
    """
    try:
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid Header Format")
        
        token = authorization.split("Bearer ")[1]
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        return uid
    except Exception as e:
        print(f"Auth Error: {e}")
        raise HTTPException(status_code=401, detail="Invalid or Expired Token")

def verify_admin(userId: str = Depends(verify_token)):
    """
    Checks if the authenticated user has 'admin' role.
    """
    user_doc = db.collection("users").document(userId).get()
    if not user_doc.exists:
        raise HTTPException(status_code=403, detail="User profile not found")
    
    data = user_doc.to_dict()
    if data.get("role") != "admin":
        raise HTTPException(status_code=403, detail="🚫 Access Denied: Admins Only")
    
    return userId

# --- ROUTES ---

@app.get("/")
def read_root():
    return {"status": "Backend is Running 🚀"}

@app.post("/api/start-round")
def start_round(request: StartRoundRequest, userId: str = Depends(verify_token)):
    """
    Marks the user as having STARTED the round. 
    Prevents re-entry if they refresh or leave.
    """
    print(f"🚦 User {userId} starting round {request.roundId}")
    try:
        user_ref = db.collection("users").document(userId)
        user_doc = user_ref.get()
        
        if user_doc.exists:
            data = user_doc.to_dict()
            # Check agar pehle se submitted hai
            if data.get(f"{request.roundId}_status") == "submitted":
                 return {"success": False, "message": "Already submitted!"}
            
            # Mark as started
            user_ref.update({
                f"{request.roundId}_status": "started",
                f"{request.roundId}_startTime": firestore.SERVER_TIMESTAMP
            })
            return {"success": True}
        else:
             raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        print(f"Error starting round: {e}")
        raise HTTPException(status_code=500, detail="Database Error")

# ✅ Updated Evaluate Route (Uses HF Space)
@app.post("/api/evaluate")
def evaluate_prompt(request: EvaluateRequest):
    # 👇 Replace with YOUR HF Space URL
    AI_ENGINE_URL = "https://rounakjain01-kaggle-koders-ai.hf.space/calculate" 
    
    payload = {
        "prompt": request.prompt,
        "target": TARGET_PROMPTS.get(request.pairId, "")
    }

    try:
        # Direct call to YOUR private server
        response = requests.post(AI_ENGINE_URL, json=payload)
        
        if response.status_code == 200:
            return {"success": True, **response.json()}
        else:
            print(f"HF Error: {response.status_code} - {response.text}")
            return {"success": False, "score": 0, "feedback": ["AI Engine Error"]}
            
    except Exception as e:
        print(f"Connection Error: {e}")
        return {"success": True, "score": 0, "feedback": ["Server Busy, try again in 2s"]}

@app.post("/api/submit-round")
def submit_round(request: RoundSubmissionRequest, userId: str = Depends(verify_token)):
    print(f"📥 Processing Submission for UserUID: {userId} | Cheating: {request.isCheating}")
    
    try:
        real_name = "Unknown Agent"
        user_doc_ref = db.collection("users").document(userId)
        user_doc = user_doc_ref.get()
        
        if user_doc.exists:
            user_data = user_doc.to_dict()
            real_name = user_data.get("fullName") or user_data.get("name") or "Anonymous"
            
            final_status = "disqualified" if request.isCheating else "submitted"

            user_doc_ref.update({
                "round1_status": final_status,
                "round1_score": request.averageScore,
                "round1_endTime": firestore.SERVER_TIMESTAMP,
                "isFlagged": request.isCheating 
            })

        doc_data = request.dict()
        doc_data["userId"] = userId
        doc_data["username"] = real_name
        doc_data["timestamp"] = firestore.SERVER_TIMESTAMP
        doc_data["round"] = 1
        doc_data["status"] = "disqualified" if request.isCheating else "valid"
        
        db.collection("leaderboard").document(userId).set(doc_data)
        
        return {"success": True, "message": "Score Saved!"}
    
    except Exception as e:
        print(f"🔥 Database Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/user-status")
def get_user_status(userId: str = Depends(verify_token)):
    try:
        doc = db.collection("users").document(userId).get()
        if doc.exists:
            data = doc.to_dict()
            return {
                "success": True, 
                "round1_status": data.get("round1_status", "pending") 
            }
        return {"success": False, "message": "User not found"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/leaderboard")
def get_leaderboard():
    try:
        docs = db.collection("leaderboard")\
                 .order_by("averageScore", direction=firestore.Query.DESCENDING)\
                 .limit(50)\
                 .stream()
        
        leaderboard_data = []
        for doc in docs:
            data = doc.to_dict()
            if "timestamp" in data and data["timestamp"]:
                 data["timestamp"] = str(data["timestamp"])
            leaderboard_data.append(data)
            
        return {"success": True, "leaderboard": leaderboard_data}
    except Exception as e:
        return {"success": False, "error": str(e)}

# ==========================
# 👑 ADMIN PANEL ROUTES
# ==========================

@app.get("/api/admin/stats")
def get_admin_stats(adminId: str = Depends(verify_admin)):
    try:
        users_ref = db.collection("users")
        all_users = users_ref.stream()
        
        stats = {"total": 0, "active": 0, "submitted": 0, "disqualified": 0}
        
        for doc in all_users:
            data = doc.to_dict()
            stats["total"] += 1
            
            status = data.get("round1_status", "pending")
            if status == "started": stats["active"] += 1
            elif status == "submitted": stats["submitted"] += 1
            elif status == "disqualified": stats["disqualified"] += 1
                
        return {"success": True, "stats": stats}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/users")
def get_all_users(adminId: str = Depends(verify_admin)):
    try:
        users_ref = db.collection("users")
        docs = users_ref.stream()
        
        users_list = []
        for doc in docs:
            data = doc.to_dict()
            safe_data = {
                "userId": doc.id,
                "name": data.get("fullName", "Unknown"),
                "email": data.get("email", "No Email"),
                "status": data.get("round1_status", "pending"),
                "score": data.get("round1_score", 0),
                "isFlagged": data.get("isFlagged", False),
                "role": data.get("role", "student")
            }
            users_list.append(safe_data)
            
        return {"success": True, "users": users_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/reset-user")
def reset_user(request: ResetUserRequest, adminId: str = Depends(verify_admin)):
    print(f"⚡ Admin {adminId} is resetting User {request.targetUserId}")
    try:
        # 1. Reset User Profile Status
        db.collection("users").document(request.targetUserId).update({
            "round1_status": "pending",
            "round1_score": 0,
            "isFlagged": False,
            "round1_startTime": firestore.DELETE_FIELD,
            "round1_endTime": firestore.DELETE_FIELD
        })
        
        # 2. Remove from Leaderboard
        db.collection("leaderboard").document(request.targetUserId).delete()
        
        return {"success": True, "message": "User access restored successfully!"}
    except Exception as e:
        print(f"Error resetting user: {e}")
        raise HTTPException(status_code=500, detail="Failed to reset user")