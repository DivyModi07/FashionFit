# FashionFit - AI-Powered Fashion Platform

A modern e-commerce platform with AI-powered virtual try-on and image search capabilities.

## Features

### 🎯 Virtual Try-On
- Upload your photo and try on any clothing item virtually
- Powered by Hugging Face IDM-VTON model
- Real-time processing with visual feedback
- Available in product details page

### 🔍 AI Image Search
- Search for similar products by uploading an image
- Powered by FashionCLIP model
- Find visually similar clothing items
- Available in the main product page

### 🛍️ E-commerce Features
- Product browsing with advanced filters
- Wishlist functionality
- Shopping cart
- User authentication
- Responsive design

## Setup

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend/fashion_backend
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the backend directory with:
   ```
   HF_API_TOKEN=your_huggingface_token_here
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Start the backend server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Try-On API
- `POST /tryon/` - Virtual try-on endpoint
  - Requires: `person_image` (file) and `cloth_image_url` (string)

### Image Search API
- `POST /products/search_image/` - Search products by image
  - Requires: `image` (file)

### Product APIs
- `GET /products/all/` - Get all products
- `POST /products/search_text/` - Search products by text
- `GET /products/recommendations/<id>/` - Get product recommendations

## Usage

### Virtual Try-On
1. Navigate to any product details page
2. Click on "Virtual Try-On" section
3. Upload your photo
4. Click "Try On This Item"
5. Wait for processing and view the result

### Image Search
1. On the main product page, click the camera icon
2. Upload an image of clothing you like
3. View similar products found by AI
4. Click the X button to clear search and return to all products

## Technologies Used

### Backend
- Django REST Framework
- FashionCLIP for image similarity
- Hugging Face IDM-VTON for virtual try-on
- PostgreSQL (recommended)

### Frontend
- React with Vite
- Tailwind CSS
- Axios for API calls
- Lucide React for icons

## Notes

- The virtual try-on feature requires a Hugging Face API token
- Image processing may take some time depending on server load
- Make sure your backend server is running on `http://127.0.0.1:8000` for the frontend to work properly
