from locust import HttpUser, task, between

class StudentUser(HttpUser):
    # Har baccha button dabane ke baad 1 se 3 second ka time lega sochne mein
    wait_time = between(1, 3)

    @task
    def test_ai_accuracy(self):
        # Yahan hum asli AI processing check karenge
        payload = {
            "prompt": "Solarpunk architecture with vertical gardens and flying cars",
            "pairId": 1
        }
        
        # DHYAN DEIN: Kyunki ab API locked hai, humein Auth header bhejna hoga.
        # Apni live website par login karein, F12 (Network tab) dabayein, 
        # aur koi bhi API call se apna Bearer Token copy karke yahan daal dein.
        headers = {
            "Authorization": "Bearer AAPKA_ASLI_TOKEN_YAHAN_DAALEIN"
        }

        # Agar token nahi daalna hai aur bina token check karna hai (toh API se Depend(verify_token) temporarily hata kar test karein)
        self.client.post("/api/evaluate", json=payload, headers=headers)