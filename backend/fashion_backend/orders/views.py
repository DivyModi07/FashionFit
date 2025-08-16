from rest_framework import generics, permissions, status,serializers
from rest_framework.response import Response
from .models import Order, OrderItem
from .serializers import OrderSerializer
from products.models import Cart  
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

class CheckPurchaseView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        product_id = request.query_params.get('product_id')
        if not product_id:
            return Response({'error': 'Product ID is required'}, status=400)

        has_purchased = OrderItem.objects.filter(
            order__user=request.user,
            product__id=product_id
        ).exists()
        
        return Response({'has_purchased': has_purchased})

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class PlaceOrderView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user
        cart_items = Cart.objects.filter(user=user)

        if not cart_items.exists():
            return Response({"error": "Your cart is empty"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Use a transaction to ensure all operations succeed or none do
        with transaction.atomic():
            total_amount = sum(item.product.final_price * item.quantity for item in cart_items)

            order = Order.objects.create(
                user=user,
                total_amount=total_amount,
                shipping_address=request.data.get("shipping_address", ""),
                billing_address=request.data.get("billing_address", ""),
            )

            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price=item.product.final_price
                )
                
                # --- NEW: Stock reduction logic ---
                product_to_update = item.product
                # Prevent stock from going below zero
                if product_to_update.stock_total >= item.quantity:
                    product_to_update.stock_total -= item.quantity
                    product_to_update.save()
                else:
                    # If stock is insufficient, cancel the whole transaction
                    raise serializers.ValidationError(f"Not enough stock for {product_to_update.short_description}. Only {product_to_update.stock_total} left.")

            cart_items.delete()  # clear cart after successful order

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
