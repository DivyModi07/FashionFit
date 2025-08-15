import os
import uuid
import requests
from gradio_client import Client, handle_file
from decouple import config
from PIL import Image
import logging
import shutil # <-- IMPORTED SHUTIL LIBRARY

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

HF_SPACE_NAME = "yisol/IDM-VTON"
HF_API_TOKEN = config("HF_API_TOKEN", default=None)

def download_image_from_url(url, save_path):
    """Download image from URL and save to local path"""
    try:
        logger.info(f"Downloading image from: {url}")
        
        # Validate URL
        if not url or not url.startswith(('http://', 'https://')):
            logger.error(f"Invalid URL format: {url}")
            return False
            
        # Add headers to mimic a browser request
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, timeout=30, headers=headers)
        response.raise_for_status()
        
        # Check if response contains image data
        content_type = response.headers.get('content-type', '')
        if not content_type.startswith('image/'):
            logger.error(f"URL does not return an image. Content-Type: {content_type}")
            return False
        
        # Save the image
        with open(save_path, 'wb') as f:
            f.write(response.content)
        
        # Verify the file was saved and is readable
        if os.path.exists(save_path) and os.path.getsize(save_path) > 0:
            try:
                with Image.open(save_path) as img:
                    img.verify()
                logger.info(f"Successfully downloaded image to: {save_path} (size: {os.path.getsize(save_path)} bytes)")
                return True
            except Exception as e:
                logger.error(f"Downloaded file is not a valid image: {e}")
                return False
        else:
            logger.error(f"Failed to save image to {save_path}")
            return False
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Error downloading image from {url}: {e}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error downloading image: {e}")
        return False

def run_tryon(person_image_path, cloth_image_path_or_url):
    """
    Calls the Hugging Face IDM-VTON Space to perform a virtual try-on.
    """
    try:
        logger.info("Starting try-on process")
        logger.info(f"Person image path: {person_image_path}")
        logger.info(f"Cloth image path/URL: {cloth_image_path_or_url}")
        
        # Check if HF_API_TOKEN is available
        if not HF_API_TOKEN:
            logger.error("HF_API_TOKEN is not configured")
            return {
                "error": "Hugging Face API token not configured",
                "details": "Please set HF_API_TOKEN in your environment variables"
            }
        
        if not os.path.exists(person_image_path):
            return {
                "error": "Person image file not found",
                "details": f"File not found: {person_image_path}"
            }
        
        client = Client(HF_SPACE_NAME, hf_token=HF_API_TOKEN)
        
        # Handle cloth image - could be a path or URL
        if cloth_image_path_or_url.startswith('http'):
            # It's a URL, download it first
            cloth_filename = f"cloth_{uuid.uuid4()}.jpg"
            cloth_save_path = os.path.join(os.path.dirname(person_image_path), cloth_filename)
            
            logger.info(f"Attempting to download cloth image from URL: {cloth_image_path_or_url}")
            if not download_image_from_url(cloth_image_path_or_url, cloth_save_path):
                return {
                    "error": "Failed to download product image",
                    "details": f"Could not download the product image from: {cloth_image_path_or_url}"
                }
            cloth_image_path = cloth_save_path
        else:
            cloth_image_path = cloth_image_path_or_url
            
        if not os.path.exists(cloth_image_path):
            return {
                "error": "Cloth image file not found",
                "details": f"File not found: {cloth_image_path}"
            }
        
        logger.info("Calling Hugging Face API for try-on")
        person_input_dict = {"background": handle_file(person_image_path), "layers": [], "composite": None}
        
        result_path, _ = client.predict(
            person_input_dict,
            garm_img=handle_file(cloth_image_path),
            garment_des="A clean garment",
            is_checked=True,
            is_checked_crop=False,
            denoise_steps=30,
            seed=42,
            api_name="/tryon"
        )
        print("RESULT PATH:", result_path)
        print("EXTRA:", extra)
        
        # Define the output directory and ensure it exists
        output_dir = os.path.join(os.path.dirname(os.path.dirname(person_image_path)), 'outputs')
        os.makedirs(output_dir, exist_ok=True)
        
        # Generate a unique filename for the output image
        unique_filename = f"{uuid.uuid4()}.png"
        final_output_path = os.path.join(output_dir, unique_filename)
        
        # The API returns a tuple of two paths, but we only need the first one.
        if os.path.exists(result_path):
            # *** THIS IS THE FIX ***
            # Use shutil.move() instead of os.rename() to handle moving files across different disk drives
            shutil.move(result_path, final_output_path)
            logger.info(f"Try-on completed successfully. Output saved to: {final_output_path}")
        else:
            return {
                "error": "Try-on failed",
                "details": "No result file was generated"
            }
        
        # Clean up temporary cloth image if it was downloaded
        if cloth_image_path_or_url.startswith('http') and os.path.exists(cloth_image_path):
            os.remove(cloth_image_path)
            logger.info("Cleaned up temporary cloth image")
        
        # Return a URL path that Django can serve from the media directory
        return {"image_url": f"outputs/{unique_filename}"}
        
    except Exception as e:
        logger.error(f"Error in try-on process: {e}")
        return {
            "error": "An error occurred during the virtual try-on process.",
            "details": str(e)
        }
