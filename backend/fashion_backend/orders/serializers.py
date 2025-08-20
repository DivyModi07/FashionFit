from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer  

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "quantity", "price"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ["id", "user", "order_date", "total_amount", "status",
                  "shipping_address", "billing_address", "items"]
        read_only_fields = ["user", "order_date", "status", "total_amount"]
