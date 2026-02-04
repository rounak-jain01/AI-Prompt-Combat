import json
import os
from datetime import datetime
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util

# --- FIREBASE IMPORTS ---
import firebase_admin
from firebase_admin import credentials, firestore, auth

# 1. Initialize Firebase (Singleton pattern to avoid re-initialization error)
if not firebase_admin._apps:
    # Check agar Render par Environment Variable set hai
    firebase_creds_json = os.getenv("FIREBASE_CREDENTIALS")
    
    if firebase_creds_json:
        # PRODUCTION: String se Dict banao
        cred_dict = json.loads(firebase_creds_json)
        cred = credentials.Certificate(cred_dict)
        print("✅ Firebase Loaded from Environment Variable (Production)")
    else:
        if os.path.exists("serviceAccountKey.json"):
            cred = credentials.Certificate("serviceAccountKey.json")
            print("✅ Firebase Loaded from Local File")
        else:
            raise Exception("❌ Firebase Key not found! Set FIREBASE_CREDENTIALS env var or add serviceAccountKey.json")

    firebase_admin.initialize_app(cred)

# Database Client
db = firestore.client()

# Init App
app = FastAPI()

# CORS Setup (Allow Frontend to connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load AI Model (Download on first run)
print("🤖 Loading AI Judge Model...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("✅ AI Judge Ready!")

# --- DATA MODELS ---

class EvaluateRequest(BaseModel):
    prompt: str
    pairId: int

# Note: 'userId' hata diya hai kyunki wo hum Token se nikalenge
class RoundSubmissionRequest(BaseModel):
    averageScore: float
    totalPairs: int
    breakdown: list  # List of { pairId, score, prompt }
    username: str = "Unknown" # ✅ Add this field

# --- HIDDEN TARGET PROMPTS (The Answers) ---
TARGET_PROMPTS = {
    1: "Solarpunk architecture with vertical gardens, lush greenery covering concrete, cascading waterfalls, futuristic sustainable design, bright sunlight, utopian atmosphere, organic shapes, high detail.",
    2: "",
    3: "MSurreal portrait made of bioluminescent blue liquid water, fluid form with splashing effects, translucent texture, glowing particles, ethereal fantasy style, dark background, magical atmosphere.assive steampunk space station shaped like a gear orbiting a planet, industrial sci-fi architecture, metallic details, cosmic background with stars, cinematic scale, intricate machinery.",
    4: "Liminal space horror playground, foggy and abandoned atmosphere, rusted metal, muted desaturated colors, eerie lighting, unsettling vibe, haunted aesthetic.",
    5: "Intricate 3D paper quilling art of a lion, layered paper strips with depth, vibrant colors, handmade craft texture, papercraft style, abstract artistic representation."
}

# --- SECURITY HELPER ---
def verify_token(authorization: str = Header(...)):
    """
    Extracts the Bearer Token from the header and verifies it with Firebase Auth.
    Returns the User UID if valid.
    """
    try:
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid Header Format")
        
        token = authorization.split("Bearer ")[1]
        
        # Verify Token with Firebase
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        return uid
    except Exception as e:
        print(f"Auth Error: {e}")
        raise HTTPException(status_code=401, detail="Invalid or Expired Token")

# --- ROUTES ---

@app.get("/")
def read_root():
    return {"status": "Kaggle Koders Backend is Running 🚀"}

@app.post("/api/evaluate")
def evaluate_prompt(request: EvaluateRequest):
    """
    Calculates similarity score between user prompt and target prompt.
    Does NOT require authentication (User can check score freely).
    """
    target_prompt = TARGET_PROMPTS.get(request.pairId)
    if not target_prompt:
        raise HTTPException(status_code=404, detail="Invalid Pair ID")
    
    # Calculate Similarity
    embeddings1 = model.encode(request.prompt, convert_to_tensor=True)
    embeddings2 = model.encode(target_prompt, convert_to_tensor=True)
    similarity_score = util.pytorch_cos_sim(embeddings1, embeddings2).item()
    
    final_score = round(similarity_score * 100)
    if final_score < 0: final_score = 0

    # Generate Insights
    feedback = []
    if final_score >= 90: feedback = ["Perfect match!", "Excellent details caught."]
    elif final_score >= 75: feedback = ["Great accuracy!", "Try refining lighting & texture."]
    elif final_score >= 50: feedback = ["Good direction.", "You missed key style elements."]
    else: feedback = ["Off track.", "Focus on the main subject and art style."]

    return {"success": True, "score": final_score, "feedback": feedback}

@app.post("/api/submit-round")
def submit_round(request: RoundSubmissionRequest, userId: str = Depends(verify_token)):
    """
    Saves score and fetches REAL NAME from 'users' collection.
    """
    print(f"📥 Processing Submission for UserUID: {userId}")
    
    try:
        # 🔍 STEP 1: Firestore 'users' collection se Real Name nikalo
        real_name = "Unknown Agent" # Default fallback
        
        # Database se user ka document dhoondo
        user_doc_ref = db.collection("users").document(userId)
        user_doc = user_doc_ref.get()
        
        if user_doc.exists:
            user_data = user_doc.to_dict()
            # 'fullName' field nikalo (Jo aapke screenshot mein hai)
            real_name = user_data.get("fullName") or user_data.get("name") or "Anonymous"
            print(f"✅ Found User Name: {real_name}")
        else:
            print("⚠️ User document not found in 'users' collection")

        # 💾 STEP 2: Data Prepare karo
        doc_data = request.dict()
        doc_data["userId"] = userId
        doc_data["username"] = real_name  # <--- Yahan humne asli naam force kar diya
        doc_data["timestamp"] = firestore.SERVER_TIMESTAMP
        doc_data["round"] = 1
        
        # 🚀 STEP 3: Leaderboard mein save karo
        db.collection("leaderboard").document(userId).set(doc_data)
        
        return {"success": True, "message": "Score & Name Saved Successfully!"}
    
    except Exception as e:
        print(f"🔥 Database Error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to save data: {str(e)}")
    

# 3. Update/Verify Leaderboard Route
@app.get("/api/leaderboard")
def get_leaderboard():
    try:
        # Fetch Top 50 (Sort by Score DESC)
        docs = db.collection("leaderboard")\
                 .order_by("averageScore", direction=firestore.Query.DESCENDING)\
                 .limit(50)\
                 .stream()
        
        leaderboard_data = []
        for doc in docs:
            data = doc.to_dict()
            # Convert timestamp to string for JSON serialization
            if "timestamp" in data and data["timestamp"]:
                 data["timestamp"] = str(data["timestamp"])
            leaderboard_data.append(data)
            
        return {"success": True, "leaderboard": leaderboard_data}
    except Exception as e:
        return {"success": False, "error": str(e)}