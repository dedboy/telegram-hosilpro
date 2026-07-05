import hashlib
import hmac
import urllib.parse
import json

def verify_telegram_data(init_data_str: str, bot_token: str):
    if not init_data_str:
        return None

    try:
        parsed_data = urllib.parse.parse_qsl(init_data_str)
        data_dict = dict(parsed_data)
        received_hash = data_dict.pop('hash', None)
        if not received_hash:
            return None

        sorted_items = sorted(data_dict.items(), key=lambda x: x[0])
        data_check_string = '\n'.join([f"{k}={v}" for k, v in sorted_items])
        
        secret_key = hmac.new(
            key=b'WebAppData', 
            msg=bot_token.encode('utf-8'), 
            digestmod=hashlib.sha256
        ).digest()
        
        calculated_hash = hmac.new(
            key=secret_key, 
            msg=data_check_string.encode('utf-8'), 
            digestmod=hashlib.sha256
        ).hexdigest()
        
        print("Data check string:")
        print(data_check_string)
        print(f"Calculated Hash: {calculated_hash}")
        print(f"Received Hash: {received_hash}")
        
        if hmac.compare_digest(calculated_hash, received_hash):
            return data_dict
            
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

# Let's generate a valid initData string manually
bot_token = "8466922786:AAGNtgiaAPPv9N9o73sZt3slAXgrQtY4FAk"
user_json = '{"id": 123456, "first_name": "Test", "last_name": "User", "username": "testuser"}'
data_dict = {
    'query_id': 'AAE123456789',
    'user': user_json,
    'auth_date': '1710000000'
}

sorted_items = sorted(data_dict.items(), key=lambda x: x[0])
data_check_string = '\n'.join([f"{k}={v}" for k, v in sorted_items])
secret_key = hmac.new(b'WebAppData', bot_token.encode('utf-8'), hashlib.sha256).digest()
valid_hash = hmac.new(secret_key, data_check_string.encode('utf-8'), hashlib.sha256).hexdigest()

data_dict['hash'] = valid_hash
init_data_str = urllib.parse.urlencode(data_dict)

print(f"Testing initData:\n{init_data_str}\n")
res = verify_telegram_data(init_data_str, bot_token)
print(f"\nResult: {res}")

