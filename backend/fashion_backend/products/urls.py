from django.urls import path
from .views import ProductListAPIView

urlpatterns = [
    path('all/', ProductListAPIView.as_view(), name='product-list'),
]
