from flask import Flask, request, jsonify, render_template, send_from_directory
import os
import json
from services.recommendation_service import ProductRecommendationService

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Initialize recommendation service
recommendation_service = ProductRecommendationService()

@app.route('/')
def index():
    """Main page with navigation to different interfaces."""
    return render_template('index.html')

@app.route('/text-query')
def text_query_page():
    """Text query interface page."""
    return render_template('text_query.html')

@app.route('/image-query')
def image_query_page():
    """Image query interface page."""
    return render_template('image_query.html')

@app.route('/product-image')
def product_image_page():
    """Product image upload interface page."""
    return render_template('product_image.html')

@app.route('/product-recommendation', methods=['POST'])
def product_recommendation():
    """
    Endpoint for product recommendations based on natural language queries.
    Input: Form data containing 'query' (string).
    Output: JSON with 'products' (array of objects) and 'response' (string).
    """
    try:
        query = request.form.get('query', '').strip()
        
        if not query:
            return jsonify({
                "error": "Query parameter is required",
                "products": [],
                "response": "Please provide a search query."
            }), 400
        
        # Process the query using recommendation service
        result = recommendation_service.process_text_query(query)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "error": f"Internal server error: {str(e)}",
            "products": [],
            "response": "Sorry, there was an error processing your request. Please try again."
        }), 500

@app.route('/ocr-query', methods=['POST'])
def ocr_query():
    """
    Endpoint to process handwritten queries extracted from uploaded images.
    Input: Form data containing 'image_data' (file, base64-encoded image or direct file upload).
    Output: JSON with 'products' (array of objects), 'response' (string), and 'extracted_text' (string).
    """
    try:
        image_file = request.files.get('image_data')
        
        if not image_file:
            return jsonify({
                "error": "No image file provided",
                "products": [],
                "response": "Please upload an image file.",
                "extracted_text": ""
            }), 400
        
        # Check file type
        allowed_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.gif'}
        file_ext = os.path.splitext(image_file.filename)[1].lower()
        
        if file_ext not in allowed_extensions:
            return jsonify({
                "error": f"Unsupported file type: {file_ext}",
                "products": [],
                "response": "Please upload a valid image file (JPG, PNG, BMP, TIFF, GIF).",
                "extracted_text": ""
            }), 400
        
        # Read image data
        image_data = image_file.read()
        
        if len(image_data) == 0:
            return jsonify({
                "error": "Empty image file",
                "products": [],
                "response": "The uploaded image file is empty.",
                "extracted_text": ""
            }), 400
        
        # Process the image using OCR and recommendation service
        result = recommendation_service.process_ocr_query(image_data)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "error": f"Internal server error: {str(e)}",
            "products": [],
            "response": "Sorry, there was an error processing your image. Please try again.",
            "extracted_text": ""
        }), 500

@app.route('/image-product-search', methods=['POST'])
def image_product_search():
    """
    Endpoint to identify and suggest products from uploaded product images.
    Input: Form data containing 'product_image' (file, base64-encoded image or direct file upload).
    Output: JSON with 'products' (array of objects), 'response' (string), and 'predicted_class' (string).
    """
    try:
        product_image = request.files.get('product_image')
        
        if not product_image:
            return jsonify({
                "error": "No product image provided",
                "products": [],
                "response": "Please upload a product image.",
                "predicted_class": ""
            }), 400
        
        # Check file type
        allowed_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.gif'}
        file_ext = os.path.splitext(product_image.filename)[1].lower()
        
        if file_ext not in allowed_extensions:
            return jsonify({
                "error": f"Unsupported file type: {file_ext}",
                "products": [],
                "response": "Please upload a valid image file (JPG, PNG, BMP, TIFF, GIF).",
                "predicted_class": ""
            }), 400
        
        # Read image data
        image_data = product_image.read()
        
        if len(image_data) == 0:
            return jsonify({
                "error": "Empty image file",
                "products": [],
                "response": "The uploaded image file is empty.",
                "predicted_class": ""
            }), 400
        
        # Process the product image using CNN and recommendation service
        result = recommendation_service.process_image_product_search(image_data)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "error": f"Internal server error: {str(e)}",
            "products": [],
            "response": "Sorry, there was an error processing your product image. Please try again.",
            "predicted_class": ""
        }), 500

@app.route('/service-status', methods=['GET'])
def service_status():
    """Get status of all services."""
    try:
        status = recommendation_service.get_service_status()
        return jsonify(status)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/dataset-summary', methods=['GET'])
def dataset_summary():
    """Get summary of the dataset."""
    try:
        summary = recommendation_service.get_dataset_summary()
        return jsonify(summary)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/sample_response', methods=['GET'])
def sample_response():
    """
    Endpoint to return a sample JSON response for the API.
    Output: JSON with 'products' (array of objects) and 'response' (string).
    """
    return render_template('sample_response.html')

@app.route('/admin/initialize', methods=['POST'])
def initialize_services():
    """Admin endpoint to initialize services."""
    try:
        success = recommendation_service.initialize_services()
        return jsonify({
            "success": success,
            "message": "Services initialized successfully" if success else "Failed to initialize services"
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@app.route('/static/<path:filename>')
def serve_static(filename):
    """Serve static files."""
    return send_from_directory('static', filename)

@app.errorhandler(413)
def too_large(e):
    return jsonify({
        "error": "File too large",
        "products": [],
        "response": "The uploaded file is too large. Maximum size is 16MB."
    }), 413

@app.errorhandler(404)
def not_found(e):
    return jsonify({
        "error": "Endpoint not found",
        "message": "The requested endpoint does not exist."
    }), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({
        "error": "Internal server error",
        "message": "An unexpected error occurred. Please try again."
    }), 500

if __name__ == '__main__':
    # Initialize services on startup
    print("Starting Flask application...")
    print("Initializing recommendation services...")
    recommendation_service.initialize_services()
    app.run(host='0.0.0.0', port=5000, debug=True)
