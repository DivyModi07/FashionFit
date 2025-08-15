#!/usr/bin/env python3
"""
Debug script for try-on functionality
"""

import os
import sys
import django
from decouple import config

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fashion_backend.settings')
django.setup()

from tryon_app.tryon_model import download_image_from_url, run_tryon
from products.models import Product

def test_image_download():
    """Test downloading a sample image"""
    print("=== Testing Image Download ===")
    
    # Test with a sample image URL
    test_url = "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop"
    test_path = "test_download.jpg"
    
    print(f"Testing download from: {test_url}")
    success = download_image_from_url(test_url, test_path)
    
    if success:
        print(f"✅ Download successful! File saved to: {test_path}")
        print(f"File size: {os.path.getsize(test_path)} bytes")
        
        # Clean up
        os.remove(test_path)
        print("Test file cleaned up")
    else:
        print("❌ Download failed!")
    
    return success

def test_hf_token():
    """Test if Hugging Face token is configured"""
    print("\n=== Testing Hugging Face Token ===")
    
    hf_token = config("HF_API_TOKEN", default=None)
    if hf_token:
        print(f"✅ HF_API_TOKEN is configured (length: {len(hf_token)})")
        return True
    else:
        print("❌ HF_API_TOKEN is not configured!")
        print("Please set HF_API_TOKEN in your .env file or environment variables")
        return False

def test_product_images():
    """Test product image URLs from database"""
    print("\n=== Testing Product Images ===")
    
    products = Product.objects.all()[:5]  # Get first 5 products
    
    if not products:
        print("No products found in database")
        return
    
    print(f"Found {products.count()} products to test")
    
    for i, product in enumerate(products):
        print(f"\nProduct {i+1}: {product.short_description}")
        
        # Test model image
        if product.model_image:
            print(f"Model image URL: {product.model_image}")
            test_path = f"test_product_{i}_model.jpg"
            success = download_image_from_url(product.model_image, test_path)
            
            if success:
                print(f"✅ Model image download successful!")
                os.remove(test_path)
            else:
                print(f"❌ Model image download failed!")
        
        # Test cutout image
        if product.cutout_image:
            print(f"Cutout image URL: {product.cutout_image}")
            test_path = f"test_product_{i}_cutout.jpg"
            success = download_image_from_url(product.cutout_image, test_path)
            
            if success:
                print(f"✅ Cutout image download successful!")
                os.remove(test_path)
            else:
                print(f"❌ Cutout image download failed!")

def main():
    """Run all tests"""
    print("🔍 Try-On Debug Script")
    print("=" * 50)
    
    # Test 1: Image download functionality
    download_works = test_image_download()
    
    # Test 2: HF Token configuration
    token_configured = test_hf_token()
    
    # Test 3: Product images from database
    test_product_images()
    
    print("\n" + "=" * 50)
    print("📋 Summary:")
    print(f"Image Download: {'✅ Working' if download_works else '❌ Failed'}")
    print(f"HF Token: {'✅ Configured' if token_configured else '❌ Not Configured'}")
    
    if not token_configured:
        print("\n🔧 To fix HF token issue:")
        print("1. Create a .env file in the backend/fashion_backend directory")
        print("2. Add: HF_API_TOKEN=your_hugging_face_token_here")
        print("3. Get your token from: https://huggingface.co/settings/tokens")

if __name__ == "__main__":
    main()
