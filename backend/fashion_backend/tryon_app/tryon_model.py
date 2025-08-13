import os
import uuid  # Import uuid for unique filenames
from gradio_client import Client, handle_file
from decouple import config

HF_SPACE_NAME = "yisol/IDM-VTON"
HF_API_TOKEN = config("HF_API_TOKEN", default=None)

def run_tryon(person_image_path, cloth_image_path):
    """
    Calls the Hugging Face IDM-VTON Space to perform a virtual try-on.
    """
    try:
        client = Client(HF_SPACE_NAME, hf_token=HF_API_TOKEN)
        
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
        
        # Define the output directory and ensure it exists
        output_dir = os.path.join(os.path.dirname(os.path.dirname(person_image_path)), 'outputs')
        os.makedirs(output_dir, exist_ok=True)
        
        # Generate a unique filename for the output image
        unique_filename = f"{uuid.uuid4()}.png"
        final_output_path = os.path.join(output_dir, unique_filename)
        
        # The API returns a tuple of two paths, but we only need the first one.
        os.rename(result_path, final_output_path)
        
        return {"image_url": f"/media/outputs/{unique_filename}"}
        
    except Exception as e:
        return {
            "error": "An error occurred during the virtual try-on process.",
            "details": str(e)
        }