from rest_framework import generics
from .models import Product
from .serializers import ProductSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .ml.search import search_by_text, search_by_image, find_similar_by_embedding


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
