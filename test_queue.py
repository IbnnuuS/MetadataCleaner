import time
import threading
import requests

API_URL = "http://127.0.0.1:8080/api/clean"
IMAGE_PATH = "D:\\Code\\AI Metadata Cleaner\\frontend\\public\\robots.txt" # any small file is fine for testing bounds

def send_request(user_id):
    print(f"[User {user_id}] Mengirim request pembersihan gambar...")
    start_time = time.time()
    
    # Create a dummy text file to act as image file (validation will fail on magic bytes but queue processing is hit first)
    try:
        # We use a dummy file content to test the queue lock duration
        files = {'file': ('test.jpg', b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00\xff\xdb\x00C...', 'image/jpeg')}
        response = requests.post(API_URL, files=files, params={"quality": 90})
        duration = time.time() - start_time
        print(f"[User {user_id}] Respons diterima! Durasi: {duration:.2f} detik. Status: {response.status_code}")
    except Exception as e:
        print(f"[User {user_id}] Gagal terhubung ke backend: {str(e)}")

def test_concurrent_queue():
    print("=== MENGUJI SISTEM ANTRIAN (QUEUE) BACKEND ===")
    threads = []
    
    # Launch 3 threads concurrently
    for i in range(1, 4):
        t = threading.Thread(target=send_request, args=(i,))
        threads.append(t)
        
    for t in threads:
        t.start()
        # Sleep short delay between starts to simulate sequential user action
        time.sleep(0.2)
        
    for t in threads:
        t.join()
    print("=== PENGUJIAN SELESAI ===")

if __name__ == "__main__":
    # Check server availability first
    try:
        requests.get("http://127.0.0.1:8080/")
        test_concurrent_queue()
    except Exception:
        print("Error: Pastikan server backend Anda berjalan di http://127.0.0.1:8080 sebelum menjalankan tes.")
