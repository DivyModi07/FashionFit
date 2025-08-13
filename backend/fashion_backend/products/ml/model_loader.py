# backend/ml/model_loader.py
import os
import torch
from PIL import Image
import numpy as np

# Try to import FashionCLIP
try:
    from fashion_clip.fashion_clip import FashionCLIP
    print("Loading FashionCLIP model...")
    model = FashionCLIP('fashion-clip')
    print("Model loaded successfully.")
except ImportError:
    print("FashionCLIP not found. Please install it first:")
    print("pip install git+https://github.com/patrickjohncyh/fashion-clip.git")
    model = None
except Exception as e:
    print(f"Error loading FashionCLIP model: {e}")
    model = None

def get_model():
    if model is None:
        raise RuntimeError("FashionCLIP model not loaded. Please check installation.")
    return model

def encode_image(image_path):
    """Encode a single image to get its embedding."""
    if model is None:
        raise RuntimeError("Model not loaded")
    
    try:
        # Load and preprocess image
        image = Image.open(image_path).convert('RGB')
        # Resize to expected dimensions (usually 224x224 for CLIP models)
        image = image.resize((224, 224))
        
        # Convert to tensor and normalize
        image_tensor = torch.tensor(np.array(image)).permute(2, 0, 1).float() / 255.0
        image_tensor = image_tensor.unsqueeze(0)  # Add batch dimension
        
        # Get embedding
        with torch.no_grad():
            embedding = model.encode_images(image_tensor)
        
        return embedding.cpu().numpy()
    except Exception as e:
        print(f"Error encoding image {image_path}: {e}")
        return None

def encode_text(text):
    """Encode text to get its embedding."""
    if model is None:
        raise RuntimeError("Model not loaded")
    
    try:
        with torch.no_grad():
            embedding = model.encode_text([text])
        return embedding.cpu().numpy()
    except Exception as e:
        print(f"Error encoding text '{text}': {e}")
        return None
