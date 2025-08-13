# products/ml/search.py

import torch
import numpy as np
from PIL import Image
from .model_loader import get_model
from products.models import Product

# Load the model once when the server starts
model = get_model()

def search_by_text(query, top_k=5):
    """Search for products by a text query."""
    all_products = list(Product.objects.exclude(embedding__isnull=True))
    if not all_products:
        return []
    product_embeddings = np.array([p.embedding for p in all_products])

    # Encode the incoming text query
    # FIX: The model already returns a NumPy array, so no conversion is needed.
    text_embedding_np = model.encode_text([query], batch_size=1)

    # Calculate cosine similarities
    similarities = np.dot(product_embeddings, text_embedding_np.T).squeeze()

    # Get the top K most similar product indices
    top_indices = similarities.argsort()[-top_k:][::-1]

    # Return the full Product objects
    return [all_products[i] for i in top_indices]


def search_by_image(image_file, top_k=5):
    """Search for products by an uploaded image."""
    all_products = list(Product.objects.exclude(embedding__isnull=True))
    if not all_products:
        return []
    product_embeddings = np.array([p.embedding for p in all_products])
    
    # Process and encode the uploaded image
    pil_image = Image.open(image_file).convert("RGB")
    
    # FIX: The model already returns a NumPy array, so no conversion is needed.
    image_embedding_np = model.encode_images([pil_image], batch_size=1)

    # Calculate cosine similarities
    similarities = np.dot(product_embeddings, image_embedding_np.T).squeeze()
    
    # Get the top K most similar product indices
    top_indices = similarities.argsort()[-top_k:][::-1]

    # Return the full Product objects
    return [all_products[i] for i in top_indices]


def find_similar_by_embedding(embedding, top_k=5, exclude_id=None):
    """Finds similar products given a pre-existing embedding."""
    
    # Get all products that have an embedding, excluding the one we are looking at
    all_other_products = list(Product.objects.exclude(embedding__isnull=True).exclude(pk=exclude_id))
    
    if not all_other_products:
        return []

    # Get the embeddings for all these other products
    product_embeddings = np.array([p.embedding for p in all_other_products])
    
    # The target embedding is already a list, so convert it to a NumPy array
    target_embedding_np = np.array(embedding)

    # Calculate similarities between the target embedding and all others
    similarities = np.dot(product_embeddings, target_embedding_np.T).squeeze()

    # Get the top K indices
    top_indices = similarities.argsort()[-top_k:][::-1]

    # Return the corresponding Product objects
    return [all_other_products[i] for i in top_indices]