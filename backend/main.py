import os
import json
from datetime import datetime
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, firestore, auth
from sentence_transformers import SentenceTransformer, util
import random
import base64
from pathlib import Path

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
    1: "A dramatic studio photo of the widebody Lamborghini from [reference image 0], re-set against a solid black background. Low-key lighting highlights the grey paintwork and sharp creases, while the vibrant red wheels remain a bold, detailed focal point. Lowered stance, sharp focus.",
    2: "Based on the architect's desk scene in image, the environment is transformed into a lush, bio-integrated sustainable workspace. The MacBook's screen now displays blueprints as green neon outlines. Small potted plants, abundant green moss, and creeping ivy overgrow the keyboard, desk, and blueprints. Miniature solar panel arrays are scattered throughout the moss and climbing the laptop. The hands, watch, and desk items are preserved but integrated with the plants and green tech. Dramatic lighting from the screen.",
    3: "A vintage botanical illustration plate on aged, textured paper, based on the composition and subjects of image. The pink and yellow blanket flower on the left and the monarch butterfly on the right are rendered in a detailed, hand-colored cross-hatch style. They are positioned within a dense, intricate background of mechanical blueprints, architectural grid-lines, and detailed monochrome scientific sketches with numerous antique handwritten labels. A prominent nautical compass rose is in the upper right. The paper is dotted with sepia tea stains and crease marks, transforming the entire scene into a scientific diagram.",
    4: "Based on the lush mossy forest scene in image, the environment is transformed into a misty, mystical realm. The original figure in the distance, now cloaked in a flowing blue-purple iridescent cape, is surrounded by swirling, ethereal wisps of light and low fog, replacing the clear view. Dramatic crepuscular sunbeams (god rays) pierce the canopy, partially obscuring the tall conifer trees. The atmosphere is shifted to a surreal, magical quality. Lowered perspective",
    5: "Based on the PC interior in image, the scene is transformed into a nature reclaiming technology aesthetic. Intricate green moss and vibrant blue buds overgrow the motherboard and metal chassis. The original rainbow ribbon cables, black heatsink, and legible component labels like RESET SW are preserved. Soft, natural sunlight highlights the contrast between the organic growth and the electronic parts. High-detail macro focus",
    
    # 👇 Naye 5 prompts yahan add karne hain 👇
    6: "A cyberpunk-themed transformation of image. The African woman's joyful pose and tools remain, but are now set against a rainy, neon-drenched futuristic city. Holographic wireframe circuits are projected onto the wooden desk and laptop, which displays a glowing data interface. As she works, intense blue and pink electrical sparks cascade around the motherboard. The lighting shifts to dramatic pink and blue neons, contrasting with the dark urban environment. High detail macro focus.",
    7: "A synthwave transformation of the laptop scene in image. The blurred laptop and background are replaced with a vibrant retro-futuristic city, featuring neon pink and cyan skyscrapers and a glowing orange-to-purple spiral portal. The 2x2 Rubik's-style cube on the keyboard is now black with glowing lime-green faces and yellow grid-line patterns. Ethereal light from the screen illuminates the keys and cube. High-detail, sharp focus on the cube, 80s aesthetic",
    8: "Based on image, this new image portrays the same black man in the identical grey hooded jacket and direct profile pose, but against a solid, textured black studio background. The overall lighting has been significantly darkened to a moody, dramatic, low-key style. Soft, directed rim lighting from the left and front precisely defines his facial features, the texture of his jacket, and the small logo, while the rest of his form fades into deep shadow. The focus is sharp on his profile and determined gaze, enhancing the intimate and atmospheric feel.",
    9: "A magical transformation of the landscape in image. The central tree is now a bioluminescent 'Tree of Life' with glowing cyan leaves, ancient twisting roots, and ethereal white spirits hanging from its branches. The background features a vibrant aurora borealis in green and purple, a crescent moon, and sparkling stardust. The calm water reflection is preserved but reflects the new mystical elements. The grassy hill is now covered in dark, purple-toned moss. High-detail, surreal fantasy style.",
    10: "A mystical, surreal transformation of the sunset landscape in image. The silhouette of the bare tree and the orange-to-blue gradient sky are preserved, but the full moon is replaced by a glowing crescent moon and a vivid, shimmering green and purple aurora borealis. The foreground now features a still, dark lake that perfectly reflects the tree, the aurora, and the sky. Numerous small, glowing white ethereal spirits float among the tree branches and across the field. The starry night sky is dense with twinkling stars and a bright distant nebula. Cinematic, high-detail fantasy aesthetic."
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


# --- SECURE IMAGE DELIVERY ROUTE ---
@app.get("/api/round1/images")
def get_randomized_images(uid: str = Depends(verify_token)):
    all_available_cases = []
    base_dir = Path("Round1Images") 
    
    # 1. Pehle saare 10 folders ko scan karke valid cases ki list banao
    for i in range(1, 11): # 1 se 10 tak check karega
        case_dir = base_dir / f"Case{i}"
        input_path = case_dir / "input.jpg"
        target_path = case_dir / "output.png"
        
        if input_path.exists() and target_path.exists():
            with open(input_path, "rb") as f:
                input_b64 = base64.b64encode(f.read()).decode('utf-8')
            with open(target_path, "rb") as f:
                target_b64 = base64.b64encode(f.read()).decode('utf-8')
                
            all_available_cases.append({
                "id": i,
                "input": f"data:image/jpeg;base64,{input_b64}",
                "target": f"data:image/png;base64,{target_b64}"
            })
    
    # 2. Check ki minimum 5 cases mil gaye hain
    if len(all_available_cases) < 5:
        return {"success": False, "message": f"Found only {len(all_available_cases)} cases. Need at least 5."}

    # 3. 🛡️ RANDOMIZATION MAGIC: 
    # 10 mein se koi bhi 5 random cases uthao (Har user ke liye alag selection)
    selected_samples = random.sample(all_available_cases, 5)
    
    # 4. Un 5 selected cases ka order bhi shuffle kardo
    random.shuffle(selected_samples)
    
    return {"success": True, "images": selected_samples}

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