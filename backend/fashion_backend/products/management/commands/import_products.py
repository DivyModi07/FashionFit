import csv
import os

from django.core.management.base import BaseCommand
from products.models import Product

class Command(BaseCommand):
    help = 'Import product data from CSV'

    def handle(self, *args, **options):
        file_path = os.path.join(os.path.dirname(__file__), 'current_farfetch_listings.csv')

        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR('❌ CSV file not found!'))
            return

        imported_count = 0
        with open(file_path, mode='r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for i, row in enumerate(reader):
                # if i >= 100:  # Limit to first 20 rows for testing
                #     break
                try:
                    Product.objects.create(
                        product_id=row.get('id'),
                        available_sizes=row.get('availableSizes'),
                        brand_id=row.get('brand.id'),
                        brand_name=row.get('brand.name'),
                        gender=row.get('gender'),
                        has_similar=row.get('hasSimilar', '').lower() == 'true',
                        cutout_image=row.get('images.cutOut'),
                        model_image=row.get('images.model'),
                        is_customizable=row.get('isCustomizable', '').lower() == 'true',
                        merchandise_label=row.get('merchandiseLabel'),
                        merchandise_labelfield=row.get('merchandiseLabelField'),
                        merchant_id=row.get('merchantId'),
                        currency=row.get('priceInfo.currencyCode'),
                        formatted_initial_price=row.get('priceInfo.formattedInitialPrice') or 0,
                        formatted_final_price=row.get('priceInfo.formattedFinalPrice') or 0,
                        initial_price=row.get('priceInfo.initialPrice') or 0,
                        final_price=row.get('priceInfo.finalPrice') or 0,
                        is_on_sale=row.get('priceInfo.isOnSale', '').lower() == 'true',
                        discount_label=row.get('priceInfo.discountLabel'),
                        short_description=row.get('shortDescription'),
                        stock_total=int(row.get('stockTotal') or 0)
                    )
                    imported_count += 1

                except Exception as e:
                    self.stdout.write(self.style.WARNING(f"⚠️ Error at row with id {row.get('id')}: {e}"))

        self.stdout.write(self.style.SUCCESS(f'✅ Imported {imported_count} products.'))
