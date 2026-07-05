from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from .models import CustomUser
from .utils import verify_telegram_data
import re

class TelegramAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        x_telegram_header = request.headers.get('X-Telegram-Init-Data')
        
        init_data = None
        
        if auth_header:
            # Expected format: "tma query_id=..." or "Bearer query_id=..."
            match = re.search(r'(?:tma|Bearer)\s+(.*)', auth_header)
            if match:
                init_data = match.group(1)
        elif x_telegram_header:
            init_data = x_telegram_header
            
        if not init_data:
            print("AUTH DEBUG: No init_data found in headers.")
            return None

        # Verify against bot token
        bot_token = getattr(settings, 'TELEGRAM_BOT_TOKEN', '8466922786:AAGNtgiaAPPv9N9o73sZt3slAXgrQtY4FAk')
        
        user_data = verify_telegram_data(init_data, bot_token)
        
        if not user_data:
            raise AuthenticationFailed({'error': 'Invalid Telegram initData signature'})

        telegram_id = str(user_data.get('id'))
        if not telegram_id:
            raise AuthenticationFailed('Telegram User ID missing')

        # Get or create the user
        user, created = CustomUser.objects.get_or_create(
            telegram_id=telegram_id,
            defaults={
                'username': user_data.get('username') or f"tg_{telegram_id}",
                'first_name': user_data.get('first_name', ''),
                'last_name': user_data.get('last_name', ''),
            }
        )
        
        # Update user details if they changed in Telegram
        if not created:
            user.username = user_data.get('username') or user.username
            user.first_name = user_data.get('first_name', user.first_name)
            user.last_name = user_data.get('last_name', user.last_name)
            user.save()
            
        return (user, init_data)
