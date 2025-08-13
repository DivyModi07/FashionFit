# tryon_app/views.py

import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from .tryon_model import run_tryon
from django.core.files.storage import FileSystemStorage

# Define the paths for input and output folders inside MEDIA_ROOT
INPUT_DIR = os.path.join(settings.MEDIA_ROOT, 'inputs')

# Initialize Django's file system storage to save uploaded files.
# It now saves directly to the input directory.
fs = FileSystemStorage(location=INPUT_DIR)

@csrf_exempt
def tryon_view(request):
    if request.method == 'POST' and request.FILES:
        try:
            # Ensure the input directory exists
            os.makedirs(INPUT_DIR, exist_ok=True)
            
            person_image_file = request.FILES.get('person_image')
            cloth_image_file = request.FILES.get('cloth_image')

            if not person_image_file or not cloth_image_file:
                return JsonResponse({'error': 'Missing image files in request. Please upload both a person image and a clothing image.'}, status=400)

            # Save the files to the new input directory
            person_filename = fs.save(person_image_file.name, person_image_file)
            cloth_filename = fs.save(cloth_image_file.name, cloth_image_file)

            # Construct the absolute file paths for the saved files
            person_image_path = os.path.join(INPUT_DIR, person_filename)
            cloth_image_path = os.path.join(INPUT_DIR, cloth_filename)

            # Call the try-on function with the saved file paths.
            result = run_tryon(person_image_path, cloth_image_path)
            
            return JsonResponse(result)
        
        except Exception as e:
            return JsonResponse({'error': f"An unexpected error occurred: {str(e)}"}, status=500)

    return JsonResponse({'error': 'Invalid request method or no files submitted. Please submit a POST request with two files.'}, status=405)