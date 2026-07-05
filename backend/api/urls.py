from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PlotViewSet, TaskViewSet, ReportViewSet, ActiveCropViewSet, WeatherView

router = DefaultRouter()
router.register(r'plots', PlotViewSet, basename='plot')
router.register(r'crops', ActiveCropViewSet, basename='crop')
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'reports', ReportViewSet, basename='report')

urlpatterns = [
    path('weather/', WeatherView.as_view(), name='weather'),
    path('', include(router.urls)),
]
