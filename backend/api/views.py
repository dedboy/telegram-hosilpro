from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import DigitalPlot, UserTask, AgroReport, ActiveCrop
from .serializers import DigitalPlotSerializer, UserTaskSerializer, AgroReportSerializer, ActiveCropSerializer
from .authentication import TelegramAuthentication

class PlotViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = DigitalPlotSerializer
    authentication_classes = [TelegramAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DigitalPlot.objects.filter(user=self.request.user)
        
    def list(self, request, *args, **kwargs):
        # Auto-create a default plot if user doesn't have one
        plot, created = DigitalPlot.objects.get_or_create(
            user=request.user,
            defaults={'size': '6 Sotix', 'soil_type': "Noma'lum"}
        )
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class ActiveCropViewSet(viewsets.ModelViewSet):
    serializer_class = ActiveCropSerializer
    authentication_classes = [TelegramAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ActiveCrop.objects.filter(plot__user=self.request.user)

    def perform_create(self, serializer):
        # Attach crop to the user's first plot
        plot = DigitalPlot.objects.filter(user=self.request.user).first()
        if not plot:
            # Create fallback plot if it doesn't exist for some reason
            plot = DigitalPlot.objects.create(user=self.request.user, size="6 Sotix", soil_type="Noma'lum")
        serializer.save(plot=plot)

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = UserTaskSerializer
    authentication_classes = [TelegramAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserTask.objects.filter(user=self.request.user).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # Auto-generate some default tasks if user has none at all
        if not queryset.exists():
            UserTask.objects.create(
                user=request.user,
                title="Tuproq namligini tekshiring",
                description="Yangi yerning namlik darajasi normada ekanligiga ishonch hosil qiling."
            )
            UserTask.objects.create(
                user=request.user,
                title="Ekinlarni sug'orish vaqti",
                description="Ertalab va kechqurun sug'orish yaxshi natija beradi."
            )
            queryset = self.get_queryset()

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        task = self.get_object()
        task.status = 'Completed'
        task.save()
        return Response({'success': True, 'message': 'Bajarildi!'})

class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = AgroReportSerializer
    authentication_classes = [TelegramAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AgroReport.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
