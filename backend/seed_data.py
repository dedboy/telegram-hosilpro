import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import CustomUser, DigitalPlot, ActiveCrop, UserTask

def run():
    print("Seeding database for MVP testing...")

    # 1. Bazadan 'SADULLO' superuserini qidirib topish
    try:
        user = CustomUser.objects.get(username='sadullo')
        print(f"Foydalanuvchi topildi: {user.username}")
    except CustomUser.DoesNotExist:
        print("Xatolik: 'sadullo' nomli foydalanuvchi topilmadi. Avval createsuperuser orqali yarating.")
        return

    # 2. Shu userga bog'langan 5 sotixli, Qora tuproqli 'DigitalPlot' yaratish
    plot, created = DigitalPlot.objects.get_or_create(
        user=user, 
        defaults={
            'size': '5 Sotix', 
            'soil_type': 'Qora tuproq'
        }
    )
    if created:
        print(f"Yangi maydon yaratildi: {plot.size}")
    else:
        print(f"Maydon allaqachon mavjud: {plot.size}")

    # 3. Shu plotga bog'langan 2 ta faol ekin qo'shish
    crop1, created1 = ActiveCrop.objects.get_or_create(
        plot=plot, 
        name='Pomidor (Tomato)', 
        defaults={
            'area': '2 Sotix', 
            'stage_description': 'Day 14', 
            'progress_percentage': 35
        }
    )
    
    crop2, created2 = ActiveCrop.objects.get_or_create(
        plot=plot, 
        name='Bodring (Cucumber)', 
        defaults={
            'area': '1 Sotix', 
            'stage_description': 'Day 5', 
            'progress_percentage': 15
        }
    )
    print("Ekinlar muvaffaqiyatli qo'shildi (yoki allaqachon mavjud).")

    # 4. Ushbu foydalanuvchi uchun 1-2 ta 'UserTask' qo'shish
    UserTask.objects.get_or_create(
        user=user, 
        crop=crop1, 
        title='Sug\'orish va o\'g\'it berish', 
        defaults={
            'description': 'Pomidorlarni vaqtida sug\'orish juda muhim.',
            'status': 'Pending'
        }
    )
    
    UserTask.objects.get_or_create(
        user=user, 
        crop=crop2, 
        title='Barglarni tekshirish', 
        defaults={
            'description': 'Bodring barglarida hasharotlar bor-yo\'qligini tekshiring.',
            'status': 'Completed'
        }
    )
    print("Topshiriqlar muvaffaqiyatli qo'shildi.")
    print("Barcha ma'lumotlar bazaga muvaffaqiyatli yozildi!")

if __name__ == '__main__':
    run()
