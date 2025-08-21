# tryon_app/views.py

import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from .tryon_model import run_tryon
from django.core.files.storage import FileSystemStorage

# Define paths and create directories
APP_MEDIA_ROOT = os.path.join(os.path.dirname(__file__), 'media')
INPUT_DIR = os.path.join(APP_MEDIA_ROOT, 'inputs')
os.makedirs(INPUT_DIR, exist_ok=True)

# File storage for saving user uploads
fs = FileSystemStorage(location=INPUT_DIR)

@csrf_exempt
def tryon_view(request):
    if request.method == 'POST':
        try:
            # --- 1. Get the uploaded person image ---
            person_image_file = request.FILES.get('person_image')
            if not person_image_file:
                return JsonResponse({'error': 'Missing person image file in request.'}, status=400)

            # --- 2. Save the person image ---
            person_filename = fs.save(person_image_file.name, person_image_file)
            person_image_path = os.path.join(INPUT_DIR, person_filename)

            # --- 3. Get the cloth image (can be a file or a URL) ---
            cloth_image_file = request.FILES.get('cloth_image')
            cloth_image_url = request.POST.get('cloth_image_url')

            if cloth_image_file:
                # If it's a file, save it and get the path
                cloth_filename = fs.save(cloth_image_file.name, cloth_image_file)
                cloth_image_path_or_url = os.path.join(INPUT_DIR, cloth_filename)
            elif cloth_image_url:
                # If it's a URL, just use the URL directly
                cloth_image_path_or_url = cloth_image_url
            else:
                return JsonResponse({'error': 'Missing cloth image (file or URL) in request.'}, status=400)

            # --- 4. Run the try-on process ---
            # The `run_tryon` function will now handle the download if it's a URL
            result = run_tryon(person_image_path, cloth_image_path_or_url)

            # --- 5. Return the result ---
            if 'error' in result:
                return JsonResponse(result, status=400)
            
            # Construct the full URL for the frontend
            result['output_image_url'] = request.build_absolute_uri(settings.MEDIA_URL + result['image_url'])
            
            return JsonResponse(result)

        except Exception as e:
            return JsonResponse({'error': f"An unexpected error occurred: {str(e)}"}, status=500)

    return JsonResponse({'error': 'Invalid request method. Please submit a POST request.'}, status=405)