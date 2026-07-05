from django.contrib import admin
from .models import CustomUser, DigitalPlot, ActiveCrop, UserTask, AgroReport

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'telegram_id', 'phone_number', 'date_joined')
    search_fields = ('username', 'telegram_id', 'phone_number')

@admin.register(DigitalPlot)
class DigitalPlotAdmin(admin.ModelAdmin):
    list_display = ('user', 'size', 'soil_type', 'created_at')
    list_filter = ('soil_type', 'created_at')
    search_fields = ('user__username', 'user__telegram_id')

@admin.register(ActiveCrop)
class ActiveCropAdmin(admin.ModelAdmin):
    list_display = ('plot', 'name', 'area', 'stage_description', 'progress_percentage')
    list_filter = ('stage_description',)
    search_fields = ('name', 'plot__user__username')

@admin.register(UserTask)
class UserTaskAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('title', 'user__username')

@admin.register(AgroReport)
class AgroReportAdmin(admin.ModelAdmin):
    list_display = ('user', 'crop_type', 'issue_description', 'created_at')
    list_filter = ('crop_type', 'created_at')
    search_fields = ('issue_description', 'user__username')