# products/management/commands/generate_embeddings.py

import requests
import logging
import time # Import the time module for retries
from io import BytesIO
from PIL import Image
from django.core.management.base import BaseCommand
from products.models import Product
from products.ml.model_loader import get_model

# Configure logging to see progress
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Generates and stores image embeddings for all existing products in the database.'

    def handle(self, *args, **kwargs):
        # Load the pre-trained FashionCLIP model
        logger.info("Loading FashionCLIP model...")
        model = get_model()
        logger.info("Model loaded successfully.")

        # Get all products that don't have an embedding yet
        products_to_process = Product.objects.filter(embedding__isnull=True)
        total_products = products_to_process.count()
        logger.info(f"Found {total_products} products to process.")

        if total_products == 0:
            self.stdout.write(self.style.SUCCESS('All products already have embeddings.'))
            return

        # --- NEW: Retry settings ---
        MAX_RETRIES = 3
        # --- END NEW ---

        # Process each product
        for i, product in enumerate(products_to_process):
            image_url = product.cutout_image
            if not image_url:
                logger.warning(f"Skipping product ID {product.product_id} due to missing image URL.")
                continue
            
            # --- NEW: Retry loop ---
            for attempt in range(MAX_RETRIES):
                try:
                    # Fetch image from URL with a longer timeout
                    response = requests.get(image_url, timeout=30) # Increased timeout to 30 seconds
                    response.raise_for_status() 
                    
                    img = Image.open(BytesIO(response.content)).convert("RGB")

                    embedding = model.encode_images([img], batch_size=1)
                    embedding_list = embedding.tolist()[0]

                    product.embedding = embedding_list
                    product.save(update_fields=['embedding'])
                    
                    logger.info(f"SUCCESS ({i + 1}/{total_products}): Product ID {product.product_id}")
                    break # If successful, exit the retry loop

                except requests.exceptions.RequestException as e:
                    logger.warning(f"Attempt {attempt + 1} failed for Product ID {product.product_id}. Error: {e}")
                    if attempt < MAX_RETRIES - 1:
                        time.sleep(2) # Wait 2 seconds before retrying
                    else:
                        logger.error(f"FINAL FAILED ({i + 1}/{total_products}): Could not process Product ID {product.product_id} after {MAX_RETRIES} attempts.")
            # --- END NEW ---


        self.stdout.write(self.style.SUCCESS('Finished processing all products.'))