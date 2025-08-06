import os
import re
from typing import List, Dict, Any, Optional
import pandas as pd
from .data_processing.data_cleaner import DataCleaner
from .vector_db.pinecone_service import PineconeVectorService
from .ocr_service.ocr_processor import OCRProcessor
from .cnn_model.cnn_trainer import CNNTrainer

class ProductRecommendationService:
    def __init__(self):
        self.data_cleaner = None
        self.vector_service = None
        self.ocr_processor = OCRProcessor()
        self.cnn_trainer = CNNTrainer()
        self.cleaned_dataset = None
        self.is_initialized = False
        
    def initialize_services(self) -> bool:
        """Initialize all services with cleaned data."""
        try:
            print("Initializing recommendation service...")
            
            # Initialize data cleaner and clean dataset
            self.data_cleaner = DataCleaner()
            
            # Check if cleaned dataset already exists
            cleaned_data_path = "data/cleaned_dataset.csv"
            if os.path.exists(cleaned_data_path):
                print("Loading existing cleaned dataset...")
                self.cleaned_dataset = pd.read_csv(cleaned_data_path)
            else:
                print("Cleaning dataset...")
                self.cleaned_dataset = self.data_cleaner.clean_dataset("data/dataset.csv")
                self.data_cleaner.save_cleaned_dataset(cleaned_data_path)
            
            # Initialize vector service
            self.vector_service = PineconeVectorService()
            
            # Try to initialize Pinecone (will fall back to local if API key not available)
            self.vector_service.initialize_pinecone()
            
            # Upload products to vector database
            if not self.cleaned_dataset.empty:
                sample_products = self.cleaned_dataset.drop_duplicates(subset=['StockCode']).head(1000)
                self.vector_service.upsert_products(sample_products)
                # Ensure products_df is set for local search
                self.vector_service.products_df = sample_products
            
            self.is_initialized = True
            print("Recommendation service initialized successfully!")
            return True
            
        except Exception as e:
            print(f"Error initializing services: {e}")
            return False
    
    def clean_and_validate_query(self, query: str) -> Dict[str, Any]:
        """Clean and validate user query for security and content."""
        if not query or not query.strip():
            return {"valid": False, "error": "Empty query"}
        
        # Remove excessive whitespace
        query = re.sub(r'\s+', ' ', query.strip())
        
        # Check for minimum length
        if len(query) < 2:
            return {"valid": False, "error": "Query too short"}
        
        # Check for maximum length
        if len(query) > 500:
            return {"valid": False, "error": "Query too long"}
        
        # Remove potentially harmful patterns
        dangerous_patterns = [
            r'<script.*?>.*?</script>',
            r'javascript:',
            r'on\w+\s*=',
            r'eval\s*\(',
            r'exec\s*\(',
        ]
        
        for pattern in dangerous_patterns:
            if re.search(pattern, query, re.IGNORECASE):
                return {"valid": False, "error": "Invalid query content"}
        
        # Filter out sensitive information patterns
        sensitive_patterns = [
            r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b',  # Credit card
            r'\b\d{3}-\d{2}-\d{4}\b',  # SSN
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',  # Email
        ]
        
        for pattern in sensitive_patterns:
            if re.search(pattern, query):
                return {"valid": False, "error": "Query contains sensitive information"}
        
        return {"valid": True, "cleaned_query": query}
    
    def process_text_query(self, query: str) -> Dict[str, Any]:
        """Process natural language query and return product recommendations."""
        if not self.is_initialized:
            if not self.initialize_services():
                return {"error": "Failed to initialize services"}
        
        # Validate query
        validation = self.clean_and_validate_query(query)
        if not validation["valid"]:
            return {"error": validation["error"], "products": [], "response": ""}
        
        cleaned_query = validation["cleaned_query"]
        
        try:
            # Search for similar products
            similar_products = self.vector_service.search_similar_products(cleaned_query, top_k=5)
            
            # Format products for response
            products = []
            for product in similar_products:
                metadata = product.get('metadata', {})
                products.append({
                    "stock_code": metadata.get('stock_code', 'N/A'),
                    "description": metadata.get('description', 'N/A'),
                    "unit_price": metadata.get('unit_price', 0.0),
                    "country": metadata.get('country', 'N/A'),
                    "similarity_score": product.get('score', 0.0)
                })
            
            # Generate natural language response
            if products:
                response = self.generate_natural_response(cleaned_query, products)
            else:
                response = f"I couldn't find any products matching '{cleaned_query}'. Please try a different search term or browse our catalog."
            
            return {
                "products": products,
                "response": response,
                "query_processed": cleaned_query,
                "total_matches": len(products)
            }
            
        except Exception as e:
            return {
                "error": f"Error processing query: {str(e)}",
                "products": [],
                "response": "Sorry, there was an error processing your request. Please try again."
            }
    
    def process_ocr_query(self, image_data: bytes) -> Dict[str, Any]:
        """Process handwritten query from image using OCR."""
        if not self.is_initialized:
            if not self.initialize_services():
                return {"error": "Failed to initialize services"}
        
        try:
            # Extract text from image
            ocr_result = self.ocr_processor.extract_text_from_bytes(image_data, preprocess=True)
            
            if not ocr_result["success"]:
                return {
                    "error": f"OCR failed: {ocr_result['error']}",
                    "products": [],
                    "response": "Could not extract text from the image. Please ensure the image is clear and contains readable text.",
                    "extracted_text": ""
                }
            
            extracted_text = ocr_result["extracted_text"]
            
            # If no text extracted
            if not extracted_text.strip():
                return {
                    "error": "No text found in image",
                    "products": [],
                    "response": "No readable text found in the image. Please try with a clearer image.",
                    "extracted_text": ""
                }
            
            # Process the extracted text as a regular query
            text_result = self.process_text_query(extracted_text)
            
            # Add OCR-specific information
            text_result["extracted_text"] = extracted_text
            text_result["ocr_confidence"] = ocr_result["confidence"]
            text_result["ocr_processing_method"] = ocr_result["processing_method"]
            
            return text_result
            
        except Exception as e:
            return {
                "error": f"Error processing OCR query: {str(e)}",
                "products": [],
                "response": "Sorry, there was an error processing your image. Please try again.",
                "extracted_text": ""
            }
    
    def process_image_product_search(self, image_data: bytes) -> Dict[str, Any]:
        """Process product image using CNN and return similar products."""
        if not self.is_initialized:
            if not self.initialize_services():
                return {"error": "Failed to initialize services"}
        
        try:
            # Use CNN to identify product
            cnn_result = self.cnn_trainer.predict_from_bytes(image_data)
            
            if "error" in cnn_result:
                return {
                    "error": f"Image classification failed: {cnn_result['error']}",
                    "products": [],
                    "response": "Could not identify the product in the image. Please try with a clearer product image.",
                    "predicted_class": ""
                }
            
            predicted_class = cnn_result["predicted_class"]
            confidence = cnn_result["confidence"]
            
            # Search for similar products using the predicted class
            similar_products = self.vector_service.search_similar_products(predicted_class, top_k=5)
            
            # Format products for response
            products = []
            for product in similar_products:
                metadata = product.get('metadata', {})
                products.append({
                    "stock_code": metadata.get('stock_code', 'N/A'),
                    "description": metadata.get('description', 'N/A'),
                    "unit_price": metadata.get('unit_price', 0.0),
                    "country": metadata.get('country', 'N/A'),
                    "similarity_score": product.get('score', 0.0)
                })
            
            # Generate natural language response
            if products:
                response = f"I identified this as a '{predicted_class}' with {confidence:.1%} confidence. Here are similar products I found:"
            else:
                response = f"I identified this as a '{predicted_class}' with {confidence:.1%} confidence, but couldn't find similar products in our catalog."
            
            return {
                "products": products,
                "response": response,
                "predicted_class": predicted_class,
                "prediction_confidence": confidence,
                "total_matches": len(products)
            }
            
        except Exception as e:
            return {
                "error": f"Error processing product image: {str(e)}",
                "products": [],
                "response": "Sorry, there was an error processing your product image. Please try again.",
                "predicted_class": ""
            }
    
    def generate_natural_response(self, query: str, products: List[Dict]) -> str:
        """Generate natural language response for product recommendations."""
        if not products:
            return f"I couldn't find any products matching '{query}'. Please try a different search term."
        
        num_products = len(products)
        
        # Create response based on number of products found
        if num_products == 1:
            product = products[0]
            response = f"I found a great match for '{query}': {product['description']} (Stock: {product['stock_code']}) priced at ${product['unit_price']:.2f}."
        else:
            response = f"I found {num_products} products matching '{query}'. Here are the top recommendations:"
            
            for i, product in enumerate(products[:3], 1):
                response += f" {i}. {product['description']} (${product['unit_price']:.2f})"
                if i < min(3, len(products)):
                    response += ","
            
            if num_products > 3:
                response += f" and {num_products - 3} more options."
        
        return response
    
    def get_service_status(self) -> Dict[str, Any]:
        """Get status of all services."""
        status = {
            "recommendation_service": self.is_initialized,
            "data_cleaner": self.data_cleaner is not None,
            "vector_service": self.vector_service is not None,
            "ocr_processor": True,  # Always available
            "cnn_trainer": True,   # Always available
        }
        
        if self.vector_service:
            status["vector_db_stats"] = self.vector_service.get_index_stats()
            status["similarity_metrics"] = self.vector_service.get_similarity_metrics()
        
        if self.cnn_trainer:
            status["cnn_model_info"] = self.cnn_trainer.get_model_info()
        
        if self.cleaned_dataset is not None:
            status["dataset_info"] = {
                "total_records": len(self.cleaned_dataset),
                "unique_products": self.cleaned_dataset['StockCode'].nunique(),
                "date_range": {
                    "start": str(self.cleaned_dataset['InvoiceDate'].min()),
                    "end": str(self.cleaned_dataset['InvoiceDate'].max())
                } if 'InvoiceDate' in self.cleaned_dataset.columns else {}
            }
        
        return status
    
    def get_dataset_summary(self) -> Dict[str, Any]:
        """Get summary of the dataset used for recommendations."""
        if self.data_cleaner and self.data_cleaner.cleaned_dataset is not None:
            return self.data_cleaner.get_dataset_summary()
        elif self.cleaned_dataset is not None:
            return {
                "total_records": len(self.cleaned_dataset),
                "unique_products": self.cleaned_dataset['StockCode'].nunique(),
                "unique_customers": self.cleaned_dataset['CustomerID'].nunique() if 'CustomerID' in self.cleaned_dataset.columns else 0,
                "countries": self.cleaned_dataset['Country'].nunique() if 'Country' in self.cleaned_dataset.columns else 0
            }
        else:
            return {"error": "No dataset available"}