from rest_framework import serializers
from .models import Product, Cart, Wishlist,Review

class ReviewSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user_email', 'rating', 'comment', 'created_at']


class ProductSerializer(serializers.ModelSerializer):
    product_reviews = ReviewSerializer(many=True, read_only=True)
    class Meta:
        model = Product
        fields = '__all__'

class SearchResultSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    description = serializers.CharField()
    brand = serializers.CharField()
    price = serializers.FloatField()
    image = serializers.URLField()
    similarity_score = serializers.FloatField()

class TextSearchSerializer(serializers.Serializer):
    query = serializers.CharField(max_length=200)
    top_k = serializers.IntegerField(default=5, min_value=1, max_value=20)

class ImageSearchSerializer(serializers.Serializer):
    image = serializers.ImageField()
    top_k = serializers.IntegerField(default=5, min_value=1, max_value=20)


class CartSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = Cart
        fields = ['id', 'user', 'product', 'product_id', 'quantity', 'added_at']
        read_only_fields = ['user']


class WishlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'product', 'product_id', 'added_at']
        read_only_fields = ['user']