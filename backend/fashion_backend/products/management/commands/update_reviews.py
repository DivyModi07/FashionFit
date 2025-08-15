import csv
import os
import json
from django.core.management.base import BaseCommand
from products.models import Product

class Command(BaseCommand):
    help = 'Update reviews for products from CSV without touching embeddings'

    def handle(self, *args, **options):
        file_path = os.path.join(os.path.dirname(__file__), 'current_farfetch_listings.csv')

        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR('❌ CSV file not found!'))
            return

        updated_count = 0
        with open(file_path, mode='r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                try:
                    product = Product.objects.get(product_id=row['id'])

                    # Parse JSON string from CSV if needed
                    try:
                        reviews_data = json.loads(row['reviews']) if row['reviews'] else []
                    except json.JSONDecodeError:
                        reviews_data = [row['reviews']]  # Store as simple list if not valid JSON

                    product.reviews = reviews_data
                    product.save(update_fields=['reviews'])
                    updated_count += 1

                except Product.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f"⚠️ No product found with product_id={row['id']}"))

        self.stdout.write(self.style.SUCCESS(f'✅ Updated reviews for {updated_count} products.'))
