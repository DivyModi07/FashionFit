# tryon_app/urls.py

from django.urls import path
from .views import tryon_view

urlpatterns = [
    path('', tryon_view, name='tryon_api'),
]