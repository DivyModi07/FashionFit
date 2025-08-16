from rest_framework import generics
from .models import Product,Cart, Wishlist
from .serializers import ProductSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .ml.search import search_by_text, search_by_image, find_similar_by_embedding
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import CartSerializer, WishlistSerializer
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404 
class ProductListAPIView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

@api_view(["POST"])
def search_text_view(request):
    query = request.data.get("query")
    if not query:
        return Response({"error": "Query is required"}, status=status.HTTP_400_BAD_REQUEST)

    # The search function now returns a list of Product model instances
    results = search_by_text(query)
    
    # We need to serialize these model instances into JSON
    serializer = ProductSerializer(results, many=True)
    return Response({"results": serializer.data})

@api_view(["POST"])
def search_image_view(request):
    if "image" not in request.FILES:
        return Response({"error": "Image file is required"}, status=status.HTTP_400_BAD_REQUEST)

    image_file = request.FILES["image"]
    
    # The search function now returns a list of Product model instances
    results = search_by_image(image_file)
    
    # We need to serialize these model instances into JSON
    serializer = ProductSerializer(results, many=True)
    return Response({"results": serializer.data})


@api_view(["GET"])
def get_recommendations_view(request, pk):
    try:
        # 1. Find the product the user is currently viewing
        target_product = Product.objects.get(pk=pk)

        # 2. Check if this product has an embedding
        if not target_product.embedding:
            # If no embedding, we can't find recommendations
            return Response({"error": "No embedding available for this product."}, status=status.HTTP_404_NOT_FOUND)

        # 3. Get its embedding
        target_embedding = target_product.embedding

        # 4. Use this embedding to find similar products
        # We pass the original product's ID to exclude it from the results
        similar_products = find_similar_by_embedding(target_embedding, top_k=5, exclude_id=pk)

        # 5. Serialize the results and send them back
        serializer = ProductSerializer(similar_products, many=True)
        return Response({"results": serializer.data})

    except Product.DoesNotExist:
        return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)




# CART
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart_items = Cart.objects.filter(user=request.user)
    serializer = CartSerializer(cart_items, many=True)
    return Response(serializer.data)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def add_to_cart(request):
#     serializer = CartSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save(user=request.user)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        user = request.user

        if not product_id:
            return Response({"error": "Product ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        product = get_object_or_404(Product, id=product_id)

        # get_or_create checks if item exists. If so, it returns the item and created=False
        cart_item, created = Cart.objects.get_or_create(
            user=user,
            product=product,
            defaults={'quantity': quantity}
        )

        if not created:
            # If the item was NOT created, it means it already exists
            return Response({"message": "Product is already in your cart"}, status=status.HTTP_200_OK)
        
        # If the item was created, return a success message
        return Response({"message": "Product added to cart"}, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, pk):
    try:
        cart_item = Cart.objects.get(pk=pk, user=request.user)
        cart_item.delete()
        return Response({"message": "Item removed from cart"})
    except Cart.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_cart_item(request, pk):
    try:
        cart_item = Cart.objects.get(pk=pk, user=request.user)
        quantity = request.data.get('quantity')
        if quantity is not None and quantity > 0:
            cart_item.quantity = quantity
            cart_item.save()
            serializer = CartSerializer(cart_item)
            return Response(serializer.data)
        else:
            return Response({"error": "Invalid quantity"}, status=status.HTTP_400_BAD_REQUEST)
    except Cart.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)


# WISHLIST
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wishlist(request):
    wishlist_items = Wishlist.objects.filter(user=request.user)
    serializer = WishlistSerializer(wishlist_items, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_wishlist(request):
    serializer = WishlistSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_wishlist(request, pk):
    try:
        wishlist_item = Wishlist.objects.get(pk=pk, user=request.user)
        wishlist_item.delete()
        return Response({"message": "Item removed from wishlist"})
    except Wishlist.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)