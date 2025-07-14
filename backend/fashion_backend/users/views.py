import random
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from django.utils import timezone

User = get_user_model()


@api_view(['POST'])
def check_email_phone(request):
    email = request.data.get('email')
    phone = request.data.get('phone')

    errors = {}

    if email and User.objects.filter(email=email).exists():
        errors['email'] = "Email already exists."

    if phone and User.objects.filter(phone=phone).exists():
        errors['phone'] = "Phone number already exists."

    if errors:
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({"message": "Available"}, status=status.HTTP_200_OK)



@api_view(['POST'])
def signup(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
def send_otp_email(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")

            if not email:
                return JsonResponse({"error": "Email is required"}, status=400)

            # Check if email exists in the database
            if not User.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email does not exist"}, status=404)

            otp = random.randint(100000, 999999)

            request.session['otp'] = str(otp)
            request.session['email'] = email
            request.session['otp_time'] = timezone.now().isoformat()  # Store OTP generation time

            subject = "Your OTP for Password Reset"
            message = f"Your OTP is {otp}. It will expire in 10 minutes."

            send_mail(subject, message, None, [email])
            return JsonResponse({"message": "OTP sent successfully"})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    # This handles GET or other methods
    return JsonResponse({"error": "Only POST method is allowed"}, status=405)

@csrf_exempt
def verify_otp(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            otp_entered = data.get("otp")

            stored_email = request.session.get('email')
            stored_otp = request.session.get('otp')
            stored_otp_time = request.session.get('otp_time')

            if not stored_email or not stored_otp or not stored_otp_time:
                return JsonResponse({"error": "Session expired or OTP not sent."}, status=400)

            # Check OTP expiry (10 minutes)
            otp_time = timezone.datetime.fromisoformat(stored_otp_time)
            now = timezone.now()
            if (now - otp_time).total_seconds() > 600:  # 600 seconds = 10 minutes
                # Clear expired OTP from session
                del request.session["otp"]
                del request.session["email"]
                del request.session["otp_time"]
                return JsonResponse({"error": "OTP has expired. Please request a new one."}, status=400)

            if email != stored_email:
                return JsonResponse({"error": "Email mismatch."}, status=400)

            if str(otp_entered) != str(stored_otp):
                return JsonResponse({"error": "Invalid OTP."}, status=400)

            # ✅ Valid OTP, optional: clear session
            del request.session["otp"]
            del request.session["email"]
            del request.session["otp_time"]

            return JsonResponse({"message": "OTP verified successfully"})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Only POST method allowed"}, status=405)

@csrf_exempt
@api_view(["POST"])
def reset_password(request):
    try:
        data = request.data
        email = data.get("email")
        new_password = data.get("new_password")

        if not email or not new_password:
            return Response({"error": "Email and new password are required"}, status=400)

        User = get_user_model()

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        user.set_password(new_password)
        user.save()

        return Response({"message": "Password reset successful"}, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=500)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

