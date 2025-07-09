from django.db import models

class Product(models.Model):
    product_id = models.BigIntegerField(unique=True, null=True, blank=True)
    brand_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=10)
    cutout_image = models.URLField()
    model_image = models.URLField()
    currency = models.CharField(max_length=10)
    price = models.FloatField()
    description = models.TextField()
    stock_total = models.IntegerField()
    is_customizable = models.BooleanField()
    discount_label = models.CharField(max_length=100, null=True, blank=True)  
    is_on_sale = models.BooleanField(default=False)                           
    short_description = models.TextField(null=True, blank=True)


    def __str__(self):
        return self.short_description or f"Product {self.id}"
