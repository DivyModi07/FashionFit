from django.urls import path
from .views import OrderListView, PlaceOrderView,CheckPurchaseView,BuyNowView

urlpatterns = [
    path("", OrderListView.as_view(), name="order-list"),
    path("place/", PlaceOrderView.as_view(), name="place-order"),
    path('check-purchase/', CheckPurchaseView.as_view(), name='check-purchase'),
    path('buy-now/', BuyNowView.as_view(), name='buy-now'),
]

