import requests

# Test 1: Healthy Chest Scan
url = 'http://127.0.0.1:8001/api/analyze/scan'
files = {'file': open('D:\\xray\\healthy_scan.jpg', 'rb')}
response = requests.post(url, files=files)
print("Healthy Scan Result:")
print(response.json())

# Test 2: Unhealthy Skull Scan
files = {'file': open('D:\\xray\\unhealthy_skull.jpg', 'rb')}
response = requests.post(url, files=files)
print("\nUnhealthy Skull Scan Result:")
print(response.json())
