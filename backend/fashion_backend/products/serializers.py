from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
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
