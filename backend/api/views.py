from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
import json
import urllib.request
from google import genai
from django.conf import settings
from .models import DigitalPlot, UserTask, AgroReport, ActiveCrop
from .serializers import DigitalPlotSerializer, UserTaskSerializer, AgroReportSerializer, ActiveCropSerializer
from .authentication import TelegramAuthentication
from .utils import send_telegram_message

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
        crop = serializer.save(plot=plot)
        send_telegram_message(
            self.request.user.telegram_id, 
            f"🌱 <b>Yangi ekin qo'shildi!</b>\n\nMaydoningizga yangi <b>{crop.name}</b> ekini muvaffaqiyatli qo'shildi. Endi sizga u haqida kundalik maslahatlar berib boraman."
        )

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
        
        # Award XP
        user = request.user
        user.xp += 50
        # Simple level up logic
        if user.xp >= 500:
            user.level = 'Agro-Master'
        elif user.xp >= 150:
            user.level = 'Tajribali Dehqon'
        user.save()

        try:
            from .utils import send_telegram_message
            chat_id = self.request.user.telegram_id
            if chat_id:
                text = f"✅ <b>Vazifa Bajarildi!</b>\n\nSiz <i>{task.title}</i> vazifasini muvaffaqiyatli yakunladingiz! Hosilingizga baraka!\n🏆 Sizga <b>+50 XP</b> berildi!"
                send_telegram_message(chat_id, text)
        except Exception as e:
            pass

        return Response({'success': True, 'message': 'Bajarildi!', 'xp': user.xp, 'level': user.level})

class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = AgroReportSerializer
    authentication_classes = [TelegramAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AgroReport.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        report = serializer.save(user=self.request.user)
        send_telegram_message(
            self.request.user.telegram_id,
            f"🚨 <b>SOS/Muammo yuborildi!</b>\n\nSizning <b>{report.crop_type}</b> dagi muammongiz (<i>{report.issue_description}</i>) mutaxassislarga (va AI Agronomga) yuborildi. Tez orada javob qaytaramiz!"
        )

class WeatherView(APIView):
    authentication_classes = [TelegramAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        lat = 41.2995
        lon = 69.2401
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
        
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode())
                current = data.get('current_weather', {})
                return Response({
                    "temperature": current.get('temperature'),
                    "windspeed": current.get('windspeed'),
                    "weathercode": current.get('weathercode'),
                    "city": "Toshkent"
                })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AIAnalyzeView(APIView):
    authentication_classes = [TelegramAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        crop_type = request.data.get('crop_type', 'Noma\'lum ekin')
        issue_description = request.data.get('issue_description', '')
        
        if not issue_description:
            return Response({"error": "No description provided"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            
            prompt = f"Sen tajribali agronom va qishloq xo'jaligi mutaxassisisan. Dehqon murojaat qilyapti. Ekin turi: {crop_type}. Muammo: {issue_description}. Qisqa, lo'nda, o'zbek tilida 2-3 gap bilan aniq yechim va maslahat ber."
            
            response = client.models.generate_content(
                model='gemini-1.5-flash',
                contents=prompt,
            )
            return Response({"analysis": response.text})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProfileView(APIView):
    authentication_classes = [TelegramAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "telegram_id": user.telegram_id,
            "xp": user.xp,
            "level": user.level
        })
