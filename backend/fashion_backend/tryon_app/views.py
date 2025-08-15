# # tryon_app/views.py

# import os
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.conf import settings
# from .tryon_model import run_tryon
# from django.core.files.storage import FileSystemStorage
# import json

# # Define the paths for input and output folders inside MEDIA_ROOT
# INPUT_DIR = os.path.join(settings.MEDIA_ROOT, 'inputs')

# # Initialize Django's file system storage to save uploaded files.
# # It now saves directly to the input directory.
# fs = FileSystemStorage(location=INPUT_DIR)

# @csrf_exempt
# def tryon_view(request):
#     if request.method == 'POST':
#         try:
#             # Ensure the input directory exists
#             os.makedirs(INPUT_DIR, exist_ok=True)
            
#             # Handle both form data and JSON data
#             if request.FILES:
#                 # Traditional form data
#                 person_image_file = request.FILES.get('person_image')
#                 cloth_image_file = request.FILES.get('cloth_image')

#                 if not person_image_file:
#                     return JsonResponse({'error': 'Missing person image file in request.'}, status=400)

#                 # Save the person image file
#                 person_filename = fs.save(person_image_file.name, person_image_file)
#                 person_image_path = os.path.join(INPUT_DIR, person_filename)

#                 # Handle cloth image - could be file or URL
#                 if cloth_image_file:
#                     cloth_filename = fs.save(cloth_image_file.name, cloth_image_file)
#                     cloth_image_path = os.path.join(INPUT_DIR, cloth_filename)
#                 else:
#                     # Try to get cloth image URL from POST data
#                     cloth_image_url = request.POST.get('cloth_image_url')
#                     if not cloth_image_url:
#                         return JsonResponse({'error': 'Missing cloth image (file or URL) in request.'}, status=400)
#                     cloth_image_path = cloth_image_url

#             else:
#                 # JSON data
#                 try:
#                     data = json.loads(request.body)
#                     person_image_file = request.FILES.get('person_image')
#                     cloth_image_url = data.get('cloth_image_url')
                    
#                     if not person_image_file:
#                         return JsonResponse({'error': 'Missing person image file in request.'}, status=400)
                    
#                     if not cloth_image_url:
#                         return JsonResponse({'error': 'Missing cloth_image_url in request.'}, status=400)
                    
#                     # Save the person image file
#                     person_filename = fs.save(person_image_file.name, person_image_file)
#                     person_image_path = os.path.join(INPUT_DIR, person_filename)
#                     cloth_image_path = cloth_image_url
                    
#                 except json.JSONDecodeError:
#                     return JsonResponse({'error': 'Invalid JSON data in request body.'}, status=400)

#             # Call the try-on function with the saved file paths.
#             result = run_tryon(person_image_path, cloth_image_path)
            
#             return JsonResponse(result)
        
#         except Exception as e:
#             return JsonResponse({'error': f"An unexpected error occurred: {str(e)}"}, status=500)

#     return JsonResponse({'error': 'Invalid request method. Please submit a POST request.'}, status=405)






# import os
# import shutil
# import requests
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.conf import settings
# from .tryon_model import run_tryon
# from django.core.files.storage import FileSystemStorage

# # Paths for inputs & outputs inside the try_on app's media folder
# APP_MEDIA_ROOT = os.path.join(os.path.dirname(__file__), 'media')
# INPUT_DIR = os.path.join(APP_MEDIA_ROOT, 'inputs')
# OUTPUT_DIR = os.path.join(APP_MEDIA_ROOT, 'output')

# os.makedirs(INPUT_DIR, exist_ok=True)
# os.makedirs(OUTPUT_DIR, exist_ok=True)

# # File storage for saving uploads
# fs = FileSystemStorage(location=INPUT_DIR)

# @csrf_exempt
# def tryon_view(request):
#     if request.method == 'POST':
#         try:
#             # Person image
#             person_image_file = request.FILES.get('person_image')
#             if not person_image_file:
#                 return JsonResponse({'error': 'Missing person image file in request.'}, status=400)

#             person_filename = fs.save(person_image_file.name, person_image_file)
#             person_image_path = os.path.join(INPUT_DIR, person_filename)

#             # Cloth image
#             cloth_image_file = request.FILES.get('cloth_image')
#             cloth_image_url = request.POST.get('cloth_image_url')

#             if cloth_image_file:
#                 cloth_filename = fs.save(cloth_image_file.name, cloth_image_file)
#                 cloth_image_path = os.path.join(INPUT_DIR, cloth_filename)
#             elif cloth_image_url:
#                 try:
#                     response = requests.get(cloth_image_url, stream=True, timeout=15)
#                     response.raise_for_status()
#                     cloth_filename = os.path.basename(cloth_image_url.split("?")[0]) or "cloth_image.jpg"
#                     cloth_image_path = os.path.join(INPUT_DIR, cloth_filename)
#                     with open(cloth_image_path, 'wb') as f:
#                         for chunk in response.iter_content(1024):
#                             f.write(chunk)
#                 except Exception as e:
#                     return JsonResponse({'error': f"Failed to download cloth image: {str(e)}"}, status=400)
#             else:
#                 return JsonResponse({'error': 'Missing cloth image (file or URL) in request.'}, status=400)

#             # Run the try-on process
#             result = run_tryon(person_image_path, cloth_image_path)

#             # Ensure output image is inside our output folder
#             if 'output_image' in result:
#                 original_output_path = result['output_image']
#                 output_filename = os.path.basename(original_output_path)
#                 correct_output_path = os.path.join(OUTPUT_DIR, output_filename)

#                 # Move file if not already there
#                 if original_output_path != correct_output_path:
#                     shutil.move(original_output_path, correct_output_path)

#                 # Update path in result
#                 result['output_image_url'] = f"/media/output/{output_filename}"

#             return JsonResponse(result)

#         except Exception as e:
#             return JsonResponse({'error': f"An unexpected error occurred: {str(e)}"}, status=500)

#     return JsonResponse({'error': 'Invalid request method. Please submit a POST request.'}, status=405)




import os
import shutil
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from .tryon_model import run_tryon
from django.core.files.storage import FileSystemStorage

# Paths for inputs & outputs inside the try_on app's media folder
APP_MEDIA_ROOT = os.path.join(os.path.dirname(__file__), 'media')
INPUT_DIR = os.path.join(APP_MEDIA_ROOT, 'inputs')
OUTPUT_DIR = os.path.join(APP_MEDIA_ROOT, 'output')

os.makedirs(INPUT_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# File storage for saving uploads
fs = FileSystemStorage(location=INPUT_DIR)

@csrf_exempt
def tryon_view(request):
    if request.method == 'POST':
        try:
            # --- Person image ---
            person_image_file = request.FILES.get('person_image')
            if not person_image_file:
                return JsonResponse({'error': 'Missing person image file in request.'}, status=400)

            person_filename = fs.save(person_image_file.name, person_image_file)
            if not person_filename.lower().endswith((".jpg", ".jpeg", ".png")):
                person_filename += ".jpg"
            person_image_path = os.path.join(INPUT_DIR, person_filename)

            # --- Cloth image ---
            cloth_image_file = request.FILES.get('cloth_image')
            cloth_image_url = request.POST.get('cloth_image_url')

            if cloth_image_file:
                cloth_filename = cloth_image_file.name
                if not cloth_filename.lower().endswith((".jpg", ".jpeg", ".png")):
                    cloth_filename += ".jpg"
                cloth_filename = fs.save(cloth_filename, cloth_image_file)
                cloth_image_path = os.path.join(INPUT_DIR, cloth_filename)

            elif cloth_image_url:
                try:
                    response = requests.get(cloth_image_url, stream=True, timeout=15)
                    response.raise_for_status()
                    cloth_filename = os.path.basename(cloth_image_url.split("?")[0]) or "cloth_image.jpg"
                    if not cloth_filename.lower().endswith((".jpg", ".jpeg", ".png")):
                        cloth_filename += ".jpg"
                    cloth_image_path = os.path.join(INPUT_DIR, cloth_filename)
                    with open(cloth_image_path, 'wb') as f:
                        for chunk in response.iter_content(1024):
                            f.write(chunk)
                except Exception as e:
                    return JsonResponse({'error': f"Failed to download cloth image: {str(e)}"}, status=400)
            else:
                return JsonResponse({'error': 'Missing cloth image (file or URL) in request.'}, status=400)

            # --- Run try-on process ---
            result = run_tryon(person_image_path, cloth_image_path)

            # --- Ensure output image is in output folder ---
            if 'output_image' in result:
                original_output_path = result['output_image']
                output_filename = os.path.basename(original_output_path)
                correct_output_path = os.path.join(OUTPUT_DIR, output_filename)

                if original_output_path != correct_output_path:
                    shutil.move(original_output_path, correct_output_path)

                result['output_image_url'] = f"/media/output/{output_filename}"

            return JsonResponse(result)

        except Exception as e:
            return JsonResponse({'error': f"An unexpected error occurred: {str(e)}"}, status=500)

    return JsonResponse({'error': 'Invalid request method. Please submit a POST request.'}, status=405)
