from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    telegram_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return self.username or str(self.telegram_id)

class DigitalPlot(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='plots')
    size = models.CharField(max_length=50) # e.g. "5 Sotix"
    soil_type = models.CharField(max_length=100) # e.g. "Qora tuproq"
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user}'s plot: {self.size}"

class ActiveCrop(models.Model):
    plot = models.ForeignKey(DigitalPlot, on_delete=models.CASCADE, related_name='crops')
    name = models.CharField(max_length=100) # e.g. "Pomidor (Tomato)"
    area = models.CharField(max_length=50) # e.g. "2 Sotix"
    stage_description = models.CharField(max_length=100, default='-') # e.g. "Day 14"
    progress_percentage = models.IntegerField(default=0)
    
    def __str__(self):
        return self.name

class UserTask(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
    ]
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='tasks')
    crop = models.ForeignKey(ActiveCrop, on_delete=models.SET_NULL, null=True, blank=True, related_name='tasks')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class AgroReport(models.Model):
    STATUS_CHOICES = [
        ('Kutish jarayonida', 'Kutish jarayonida'),
        ('Ko\'rib chiqilmoqda', 'Ko\'rib chiqilmoqda'),
        ('Yechim berildi', 'Yechim berildi'),
    ]
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reports')
    crop_type = models.CharField(max_length=100)
    issue_description = models.TextField()
    image = models.ImageField(upload_to='reports/', null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Kutish jarayonida')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report: {self.crop_type} by {self.user}"
