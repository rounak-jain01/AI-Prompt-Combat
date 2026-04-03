import firebase_admin
from firebase_admin import credentials, auth, firestore
import csv
import time

# --- CONFIGURATION ---
CREDENTIALS_FILE = "serviceAccountKey.json"
CSV_FILE = "participants.csv"
DEFAULT_PASSWORD = "123456"  # Baccho ko yeh password dena hai

print("🔄 Firebase se connect ho raha hai...")
try:
    cred = credentials.Certificate(CREDENTIALS_FILE)
    firebase_admin.initialize_app(cred)
    db = firestore.client()  # Database se connection
    print("✅ Connection Successful!\n")
except Exception as e:
    print(f"❌ Connection Error: {e}")
    exit()

def bulk_register_users():
    print(f"📂 '{CSV_FILE}' file read ki ja rahi hai...")
    
    success_count = 0
    fail_count = 0
    
    try:
        with open(CSV_FILE, mode='r', encoding='utf-8-sig') as file:
            csv_reader = csv.DictReader(file)
            
            if csv_reader.fieldnames:
                csv_reader.fieldnames = [field.strip().lower() for field in csv_reader.fieldnames]
            
            for row in csv_reader:
                name = row.get('name', '')
                email = row.get('email', '')
                
                if name is None or email is None:
                    continue
                    
                name = name.strip()
                email = email.strip().lower()
                
                if not name or not email:
                    continue
                
                try:
                    # AUTHENTICATION MEIN USER BANAO (With Verified Email)
                    user = auth.create_user(
                        email=email,
                        password=DEFAULT_PASSWORD,
                        display_name=name,
                        email_verified=True  # ✅ YEH LINE MAGIC KAREGI!
                    )
                    
                    # FIRESTORE DATABASE MEIN RECORD BANAO
                    user_data = {
                        "fullName": name,
                        "email": email,
                        "role": "student",
                        "round1_status": "pending",
                        "round1_score": 0,
                        "round2_status": "pending",
                        "round2_score": 0,
                        "createdAt": firestore.SERVER_TIMESTAMP
                    }
                    
                    db.collection("users").document(user.uid).set(user_data)
                    
                    print(f"✅ Created & Verified: {name} ({email})")
                    success_count += 1
                    time.sleep(0.1) 
                    
                except auth.EmailAlreadyExistsError:
                    print(f"⚠️  Already Exists (Pehle se hai): {email}")
                    fail_count += 1
                except Exception as e:
                    print(f"❌ Error for {email}: {str(e)}")
                    fail_count += 1
                    
    except FileNotFoundError:
        print(f"❌ Error: '{CSV_FILE}' nahi mili. File ka naam check karein.")
        return

    # Final Report
    print("\n" + "="*40)
    print("🎯 REGISTRATION COMPLETE")
    print(f"✔️ Successfully added: {success_count} users")
    print(f"❌ Failed/Skipped: {fail_count} users")
    print(f"🔑 Sabka password hai: {DEFAULT_PASSWORD}")
    print("="*40)

if __name__ == "__main__":
    bulk_register_users()