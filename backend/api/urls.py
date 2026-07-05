from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PlotViewSet, TaskViewSet, ReportViewSet, ActiveCropViewSet, WeatherView, AIAnalyzeView, ProfileView

router = DefaultRouter()
router.register(r'plots', PlotViewSet, basename='plot')
router.register(r'crops', ActiveCropViewSet, basename='crop')
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'reports', ReportViewSet, basename='report')

urlpatterns = [
    path('weather/', WeatherView.as_view(), name='weather'),
    path('ai-analyze/', AIAnalyzeView.as_view(), name='ai-analyze'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('', include(router.urls)),
]
