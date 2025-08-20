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
                
                
                product_to_update = item.product
                if product_to_update.stock_total >= item.quantity:
                    product_to_update.stock_total -= item.quantity
                    product_to_update.save()
                else:
                    raise serializers.ValidationError(f"Not enough stock for {product_to_update.short_description}. Only {product_to_update.stock_total} left.")

            cart_items.delete()  

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)




# --- NEW: Dedicated View for "Buy Now" ---
class BuyNowView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))

        if not product_id:
            return Response({"error": "Product ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        with transaction.atomic():
            # Check for sufficient stock before creating the order
            if product.stock_total < quantity:
                raise serializers.ValidationError(f"Not enough stock for {product.short_description}. Only {product.stock_total} left.")

            total_amount = product.final_price * quantity
            
            order = Order.objects.create(
                user=user,
                total_amount=total_amount,
                shipping_address=request.data.get("shipping_address", ""),
                billing_address=request.data.get("billing_address", ""),
            )

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=product.final_price
            )
            
            # Reduce stock
            product.stock_total -= quantity
            product.save()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)