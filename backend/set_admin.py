import firebase_admin
from firebase_admin import credentials, firestore
import os

# 1. Initialize Firebase (Check serviceAccountKey)
if not firebase_admin._apps:
    if os.path.exists("serviceAccountKey.json"):
        cred = credentials.Certificate("serviceAccountKey.json")
        firebase_admin.initialize_app(cred)
    else:
        print("❌ Error: serviceAccountKey.json not found!")
        exit()

db = firestore.client()

def make_admin():
    # User se email maango
    target_email = input("\n📧 Enter the Email you want to make Admin: ").strip()
    
    print(f"🔍 Searching for {target_email}...")

    # Users collection mein dhoondo
    users_ref = db.collection("users")
    # Note: Yeh tabhi chalega agar aapne DB mein email field save kiya hai.
    # Agar nahi, toh hum auth se UID nikalne ka try karenge (requires firebase-admin auth), 
    # but for now let's try direct DB query assuming you logged in once.
    
    query = users_ref.where("email", "==", target_email).stream()
    
    found = False
    for doc in query:
        found = True
        user_id = doc.id
        print(f"✅ User Found! UID: {user_id}")
        
        # Update Role
        users_ref.document(user_id).update({
            "role": "admin"
        })
        print(f"🎉 Success! {target_email} is now an ADMIN.")
    
    if not found:
        print("❌ User not found in 'users' collection.")
        print("Tip: Pehle website par ek baar Login kar lein taaki entry ban jaye.")
        
        # Fallback: Ask for UID manually
        print("\n--- Manual Mode ---")
        uid = input("Paste User UID directly (from Firebase Auth): ").strip()
        if uid:
            try:
                users_ref.document(uid).set({"role": "admin"}, merge=True)
                print(f"✅ Force updated UID {uid} to Admin.")
            except Exception as e:
                print(f"Error: {e}")

if __name__ == "__main__":
    make_admin()