import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import CustomUser, DigitalPlot, ActiveCrop, UserTask, AgroReport

def run():
    user, _ = CustomUser.objects.get_or_create(username='testfarmer', defaults={'telegram_id': '12345', 'phone_number': '+998901234567'})
    
    plot, _ = DigitalPlot.objects.get_or_create(user=user, size='5 Sotix', soil_type='Qora tuproq')
    
    crop1, _ = ActiveCrop.objects.get_or_create(plot=plot, name='Pomidor (Tomato)', area='2 Sotix', stage_description='Day 14', progress_percentage=35)
    crop2, _ = ActiveCrop.objects.get_or_create(plot=plot, name='Bodring (Cucumber)', area='1 Sotix', stage_description='Day 5', progress_percentage=15)
    
    UserTask.objects.get_or_create(user=user, crop=crop1, title='Sug\'orish va o\'g\'it berish (Water & Fertilize)', status='Pending')
    UserTask.objects.get_or_create(user=user, crop=crop2, title='Barglarni tekshirish (Check for pests)', status='Completed')
    
    AgroReport.objects.get_or_create(user=user, crop_type='Pomidor', issue_description='Sariq barglar (Yellow leaves)', status='Yechim berildi')
    AgroReport.objects.get_or_create(user=user, crop_type='Bodring', issue_description='Hasosot ehtimoli (Pest likelihood)', status='Ko\'rib chiqilmoqda')
    
    print("Database successfully seeded with AgroTech mock data!")

if __name__ == '__main__':
    run()
