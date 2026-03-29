import firebase_admin
from firebase_admin import credentials, auth

# 1. Apni JSON key ka path yahan daalein
CREDENTIALS_FILE = "serviceAccountKey.json"

try:
    print("🔄 Firebase se connect ho raha hai...")
    cred = credentials.Certificate(CREDENTIALS_FILE)
    firebase_admin.initialize_app(cred)
    print("✅ Connection Successful!\n")
except Exception as e:
    print(f"❌ Connection Error: {e}")
    exit()

def delete_all_auth_users():
    print("⚠️  WARNING: YEH SCRIPT FIREBASE AUTHENTICATION KE SAARE USERS DELETE KAR DEGI!")
    print("⚠️  Yeh action wapas (undo) nahi kiya ja sakta.\n")
    
    # Safety Lock
    confirm = input("Kripya confirm karne ke liye 'YES' type karein (capital letters mein): ")
    if confirm != "YES":
        print("🛑 Operation Cancelled. Koi data delete nahi hua.")
        return

    print("\n🔍 Users fetch kiye ja rahe hain...")
    
    try:
        # Saare users fetch karna (Pagination ke sath)
        users = auth.list_users().iterate_all()
        uids_to_delete = [user.uid for user in users]
        total_users = len(uids_to_delete)

        if total_users == 0:
            print("🟢 Authentication table pehle se hi khali hai. Koi user nahi mila.")
            return

        print(f"📦 Total {total_users} dummy users mile hain.")
        print("🗑️ Deletion start ho raha hai...\n")

        # Firebase allow maximum 1000 users deletion in one API call
        # Hum chunking (batches) ka use karenge
        chunk_size = 1000
        for i in range(0, total_users, chunk_size):
            chunk = uids_to_delete[i:i + chunk_size]
            result = auth.delete_users(chunk)
            print(f"✅ Batch {i // chunk_size + 1}: Successfully deleted {result.success_count} users.")
            if result.failure_count > 0:
                print(f"❌ Failed to delete {result.failure_count} users in this batch.")

        print("\n🎉 MISSION ACCOMPLISHED: Authentication table puri tarah saaf ho chuki hai!")
        
    except Exception as e:
        print(f"❌ Error aayi hai: {e}")

if __name__ == "__main__":
    delete_all_auth_users()