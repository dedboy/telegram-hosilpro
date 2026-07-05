from rest_framework import serializers
from .models import CustomUser, DigitalPlot, ActiveCrop, UserTask, AgroReport

class ActiveCropSerializer(serializers.ModelSerializer):
    # Map model fields to frontend expected fields
    stage = serializers.CharField(source='stage_description')
    progress = serializers.IntegerField(source='progress_percentage')
    
    class Meta:
        model = ActiveCrop
        fields = ['id', 'name', 'area', 'stage', 'progress']

class DigitalPlotSerializer(serializers.ModelSerializer):
    crops = ActiveCropSerializer(many=True, read_only=True)
    soilType = serializers.CharField(source='soil_type')

    class Meta:
        model = DigitalPlot
        fields = ['id', 'size', 'soilType', 'crops']

class UserTaskSerializer(serializers.ModelSerializer):
    crop_name = serializers.CharField(source='crop.name', read_only=True)
    task = serializers.CharField(source='title')
    completed = serializers.SerializerMethodField()

    class Meta:
        model = UserTask
        fields = ['id', 'crop_name', 'task', 'description', 'completed', 'status']

    def get_completed(self, obj):
        return obj.status == 'Completed'

class AgroReportSerializer(serializers.ModelSerializer):
    crop = serializers.CharField(source='crop_type')
    description = serializers.CharField(source='issue_description')

    class Meta:
        model = AgroReport
        fields = ['id', 'crop', 'description', 'image', 'status', 'created_at']
