from django.urls import path
from .views import AddToCartView,ProductListAPIView, search_text_view, search_image_view, get_recommendations_view, get_cart, remove_from_cart, update_cart_item, get_wishlist, add_to_wishlist, remove_from_wishlist


urlpatterns = [
    path('all/', ProductListAPIView.as_view(), name='product-list'),
    path('search_text/', search_text_view, name="search_text"),
    path('search_image/', search_image_view, name="search_image"),
    path('recommendations/<int:pk>/', get_recommendations_view, name="get_recommendations"),
     # Cart
    path('cart/', get_cart, name='get_cart'),
    path('cart/add/', AddToCartView.as_view(), name='add_to_cart'),
    path('cart/<int:pk>/delete/', remove_from_cart, name='remove_from_cart'),
    path('cart/<int:pk>/update/', update_cart_item, name='update_cart_item'),

    # Wishlist
    path('wishlist/', get_wishlist, name='get_wishlist'),
    path('wishlist/add/', add_to_wishlist, name='add_to_wishlist'),
    path('wishlist/<int:pk>/delete/', remove_from_wishlist, name='remove_from_wishlist'),
]