import urllib.request
import urllib.parse
import json
from django.conf import settings

def send_telegram_message(chat_id, text):
    """
    Sends a message to a Telegram user via the bot.
    """
    token = settings.TELEGRAM_BOT_TOKEN
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    
    data = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML"
    }
    
    # URL encode and send
    data_encoded = urllib.parse.urlencode(data).encode('utf-8')
    req = urllib.request.Request(url, data=data_encoded)
    
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"Failed to send Telegram message: {e}")
        return None
