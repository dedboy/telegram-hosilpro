import hashlib
import hmac
import urllib.parse
import json

init_data_str = "query_id=AAEK380wAwAAAArfzTDn6qS3&user=%7B%22id%22%3A7261249290%2C%22first_name%22%3A%22Sa%27dullo%22%2C%22last_name%22%3A%22Obidjonov%22%2C%22username%22%3A%22sadullo_1%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FoaBvEGMTjyWJ9GYuj1KmFRqhE3fEEnEPNBkevnfksf_fs-OrtEpkaw5QgXQYSGtv.svg%22%7D&auth_date=1783240076&signature=Fu5EpKULU8TuZGJXGPP-YW4l5cijdLqQgUkDqXdRwzpl6S_2QhKEZfKAFWzZsRXnGI8q2A4ODOTZtC3hD_bEAw&hash=d0ed7162b905eaec62d8d89fc53531bb5a2c1abd64b5c9fc571cef463b343103"

parsed_data = urllib.parse.parse_qsl(init_data_str, keep_blank_values=True)
data_dict = dict(parsed_data)
received_hash = data_dict.pop('hash', None)

# TEST BOTH TOKENS
tokens = [
    "8761808924:AAGrTornZrY2dRAbrMb-2NaIAXqYjo9Isgw",
    "8466922786:AAGNtgiaAPPv9N9o73sZt3slAXgrQtY4FAk"
]

sorted_items = sorted(data_dict.items(), key=lambda x: x[0])
data_check_string = '\n'.join([f"{k}={v}" for k, v in sorted_items])

print(f"Data Check String:\n{data_check_string}\n")
print(f"Received Hash: {received_hash}\n")

for token in tokens:
    secret_key = hmac.new(
        key=b'WebAppData', 
        msg=token.encode('utf-8'), 
        digestmod=hashlib.sha256
    ).digest()
    
    calculated_hash = hmac.new(
        key=secret_key, 
        msg=data_check_string.encode('utf-8'), 
        digestmod=hashlib.sha256
    ).hexdigest()
    
    print(f"Token: {token}\nCalculated Hash: {calculated_hash}")
    if calculated_hash == received_hash:
        print("MATCHED!!!")
    else:
        print("Mismatch.")
    print("-" * 30)

