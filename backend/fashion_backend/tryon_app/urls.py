# tryon_app/urls.py

from django.urls import path
from .views import tryon_view
from django.conf.urls.static import static
from django.conf import settings
urlpatterns = [
    path('', tryon_view, name='tryon_api'),
]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)