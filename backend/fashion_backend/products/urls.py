from django.urls import path
from .views import ProductListAPIView, search_text_view, search_image_view, get_recommendations_view


urlpatterns = [
    path('all/', ProductListAPIView.as_view(), name='product-list'),
    path('search_text/', search_text_view, name="search_text"),
    path('search_image/', search_image_view, name="search_image"),
    path('recommendations/<int:pk>/', get_recommendations_view, name="get_recommendations"),
]