from django.contrib import admin
from .models import CustomUser, DigitalPlot, ActiveCrop, UserTask, AgroReport

# admin.site.register(CustomUser)
admin.site.register(DigitalPlot)
admin.site.register(ActiveCrop)
admin.site.register(UserTask)
admin.site.register(AgroReport)