from django.urls import path
from .views import OrderListView, PlaceOrderView

urlpatterns = [
    path("", OrderListView.as_view(), name="order-list"),
    path("place/", PlaceOrderView.as_view(), name="place-order"),
]
