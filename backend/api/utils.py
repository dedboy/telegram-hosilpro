import hashlib
import hmac
import urllib.parse
import json

def verify_telegram_data(init_data_str: str, bot_token: str):
    """
    Verifies Telegram WebApp initData string using HMAC-SHA256.
    Returns parsed user dict if valid, else None.
    """
    if not init_data_str:
        return None

    try:
        # Parse the URL-encoded query string
        parsed_data = urllib.parse.parse_qsl(init_data_str)
        
        # Convert to dictionary and extract 'hash'
        data_dict = dict(parsed_data)
        received_hash = data_dict.pop('hash', None)
        
        if not received_hash:
            return None

        # Sort the remaining key-value pairs alphabetically by key
        sorted_items = sorted(data_dict.items(), key=lambda x: x[0])
        
        # Create the data check string
        data_check_string = '\n'.join([f"{k}={v}" for k, v in sorted_items])
        
        # Compute the secret key using the bot token
        secret_key = hmac.new(
            key=b'WebAppData', 
            msg=bot_token.encode('utf-8'), 
            digestmod=hashlib.sha256
        ).digest()
        
        # Compute the final hash
        calculated_hash = hmac.new(
            key=secret_key, 
            msg=data_check_string.encode('utf-8'), 
            digestmod=hashlib.sha256
        ).hexdigest()
        
        if hmac.compare_digest(calculated_hash, received_hash):
            user_data_json = data_dict.get('user', '{}')
            user_data = json.loads(user_data_json)
            return user_data
            
        return None
    except Exception as e:
        print(f"Telegram validation error: {e}")
        return None
