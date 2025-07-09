from django.urls import path
from .views import signup, send_otp_email, verify_otp, reset_password,check_email_phone

urlpatterns = [
    path('signup/', signup, name='signup'),
    path("send-otp/", send_otp_email),
    path('verify-otp/', verify_otp),
    path('reset-password/', reset_password),
    path('check-email-phone/', check_email_phone),
]