from django.apps import AppConfig


class ApiConfig(AppConfig):
    name = 'api'

    def ready(self):
        import os
        from django.core.management import call_command
        
        # We wrap this in a try-except to avoid issues during migrations
        try:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            if not User.objects.filter(username='admin').exists():
                User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
                print("Superuser 'admin' created automatically.")
        except Exception:
            pass
