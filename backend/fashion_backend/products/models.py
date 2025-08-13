# products/models.py

from django.db import models

class Product(models.Model):
    product_id = models.BigIntegerField(unique=True, null=True, blank=True)
    available_sizes = models.TextField(null=True, blank=True)
    brand_id = models.BigIntegerField(null=True, blank=True)
    brand_name = models.CharField(max_length=100, null=True, blank=True)
    gender = models.CharField(max_length=10, null=True, blank=True)
    has_similar = models.BooleanField(default=False)
    cutout_image = models.URLField(null=True, blank=True)
    model_image = models.URLField(null=True, blank=True)
    is_customizable = models.BooleanField(default=False)
    merchandise_label = models.CharField(max_length=100, null=True, blank=True)
    merchandise_labelfield = models.CharField(max_length=50, null=True, blank=True)
    merchant_id = models.BigIntegerField(null=True, blank=True)
    currency = models.CharField(max_length=10, null=True, blank=True)
    initial_price = models.FloatField(null=True, blank=True)
    final_price = models.FloatField(null=True, blank=True)
    formatted_initial_price = models.CharField(max_length=100, null=True, blank=True)
    formatted_final_price = models.CharField(max_length=100, null=True, blank=True)
    is_on_sale = models.BooleanField(default=False)
    discount_label = models.CharField(max_length=100, null=True, blank=True)
    short_description = models.TextField(null=True, blank=True)
    stock_total = models.IntegerField(null=True, blank=True)

    # Add this line!
    embedding = models.JSONField(null=True, blank=True)

    def __str__(self):
        return self.short_description or f"Product {self.id}"