import requests
import concurrent.futures
import time
import random

# --- CONFIGURATION ---
RENDER_URL = "https://kaggle-koders-backend.onrender.com"  # Aapka Live Backend
HF_AI_URL = "https://rounakjain01-kaggle-koders-ai.hf.space/calculate" # Aapka AI Engine

TOTAL_REQUESTS = 500   # Kitni total requests bhejni hain? (Start small: 50)
CONCURRENT_USERS = 50 # Ek saath kitne log click karenge? (Concurrency)

# Dummy Data for AI
payload = {
    "prompt": "A futuristic city with flying cars and neon lights, cyberpunk style",
    "target": "A futuristic city with flying cars and neon lights, cyberpunk style"
}

def test_server(request_id):
    """
    Yeh function ek user ki tarah behave karega.
    """
    try:
        start_time = time.time()
        
        # 1. Check Render Backend Health (Lightweight)
        res_backend = requests.get(f"{RENDER_URL}/")
        backend_status = res_backend.status_code
        
        # 2. Check AI Engine (Heavyweight - Direct Hit)
        # Note: Hum direct HF ko hit kar rahe hain taaki backend auth bypass ho sake testing ke liye
        res_ai = requests.post(HF_AI_URL, json=payload, timeout=10)
        ai_status = res_ai.status_code
        
        duration = round(time.time() - start_time, 2)
        
        if backend_status == 200 and ai_status == 200:
            return f"✅ User {request_id}: Success ({duration}s)"
        else:
            return f"❌ User {request_id}: Failed (Backend: {backend_status}, AI: {ai_status})"

    except Exception as e:
        return f"🔥 User {request_id}: Error - {str(e)}"

print(f"🚀 Starting Load Test: {TOTAL_REQUESTS} Requests with {CONCURRENT_USERS} Concurrent Users...")
print("-" * 60)

# Threading ka use karke ek saath hamla bolenge
start_global = time.time()
success_count = 0

with concurrent.futures.ThreadPoolExecutor(max_workers=CONCURRENT_USERS) as executor:
    # Requests generate karna
    futures = [executor.submit(test_server, i) for i in range(1, TOTAL_REQUESTS + 1)]
    
    for future in concurrent.futures.as_completed(futures):
        result = future.result()
        print(result)
        if "Success" in result:
            success_count += 1

end_global = time.time()
total_time = round(end_global - start_global, 2)

print("-" * 60)
print(f"🏁 Test Complete in {total_time} seconds")
print(f"📊 Success Rate: {success_count}/{TOTAL_REQUESTS}")
print(f"⚡ Avg Speed: {round(TOTAL_REQUESTS/total_time, 2)} req/sec")

if success_count == TOTAL_REQUESTS:
    print("✅ SYSTEM STABLE: All systems go!")
else:
    print("⚠️ WARNING: Some requests failed. Check logs.")