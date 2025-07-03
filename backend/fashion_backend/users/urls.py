from django.urls import path
from .views import hello_api

urlpatterns = [
    path('hello-api/', hello_api, name='hello_api'),
]