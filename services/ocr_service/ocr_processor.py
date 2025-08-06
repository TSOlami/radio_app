import cv2
import numpy as np
from PIL import Image
import pytesseract
import os
from typing import Optional, Dict, Any, List, Tuple
import re

class OCRProcessor:
    def __init__(self, tesseract_path: Optional[str] = None):
        """Initialize OCR processor with optional Tesseract path."""
        if tesseract_path:
            pytesseract.pytesseract.tesseract_cmd = tesseract_path
        self.supported_formats = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.gif'}
        
    def preprocess_image(self, image: np.ndarray) -> np.ndarray:
        """Preprocess image for better OCR results."""
        # Convert to grayscale if needed
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image.copy()
        
        # Apply Gaussian blur to reduce noise
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        
        # Apply threshold to get binary image
        _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Morphological operations to clean up the image
        kernel = np.ones((1, 1), np.uint8)
        processed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
        processed = cv2.morphologyEx(processed, cv2.MORPH_OPEN, kernel)
        
        return processed
    
    def enhance_image_quality(self, image: np.ndarray) -> np.ndarray:
        """Enhance image quality for better text recognition."""
        # Resize image if too small
        height, width = image.shape[:2]
        if height < 300 or width < 300:
            scale_factor = max(300/height, 300/width)
            new_width = int(width * scale_factor)
            new_height = int(height * scale_factor)
            image = cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_CUBIC)
        
        # Apply sharpening filter
        kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]])
        sharpened = cv2.filter2D(image, -1, kernel)
        
        return sharpened
    
    def extract_text_from_image(self, image_path: str, preprocess: bool = True) -> Dict[str, Any]:
        """Extract text from image file."""
        try:
            # Validate file format
            file_ext = os.path.splitext(image_path)[1].lower()
            if file_ext not in self.supported_formats:
                return {
                    "success": False,
                    "error": f"Unsupported file format: {file_ext}",
                    "extracted_text": "",
                    "confidence": 0.0
                }
            
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                return {
                    "success": False,
                    "error": "Unable to load image",
                    "extracted_text": "",
                    "confidence": 0.0
                }
            
            # Preprocess if requested
            if preprocess:
                image = self.enhance_image_quality(image)
                image = self.preprocess_image(image)
            
            # Convert to PIL Image for pytesseract
            pil_image = Image.fromarray(image)
            
            # Extract text with confidence scores
            text_data = pytesseract.image_to_data(pil_image, output_type=pytesseract.Output.DICT)
            
            # Filter out low confidence text
            filtered_text = []
            confidences = []
            
            for i in range(len(text_data['text'])):
                if int(text_data['conf'][i]) > 30:  # Confidence threshold
                    text = text_data['text'][i].strip()
                    if text:
                        filtered_text.append(text)
                        confidences.append(int(text_data['conf'][i]))
            
            # Combine text
            extracted_text = ' '.join(filtered_text)
            avg_confidence = np.mean(confidences) if confidences else 0.0
            
            # Clean extracted text
            cleaned_text = self.clean_extracted_text(extracted_text)
            
            return {
                "success": True,
                "extracted_text": cleaned_text,
                "raw_text": extracted_text,
                "confidence": avg_confidence,
                "word_count": len(cleaned_text.split()),
                "processing_method": "enhanced_preprocessing" if preprocess else "direct_extraction"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "extracted_text": "",
                "confidence": 0.0
            }
    
    def extract_text_from_bytes(self, image_bytes: bytes, preprocess: bool = True) -> Dict[str, Any]:
        """Extract text from image bytes."""
        try:
            # Convert bytes to numpy array
            nparr = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if image is None:
                return {
                    "success": False,
                    "error": "Unable to decode image bytes",
                    "extracted_text": "",
                    "confidence": 0.0
                }
            
            # Preprocess if requested
            if preprocess:
                image = self.enhance_image_quality(image)
                image = self.preprocess_image(image)
            
            # Convert to PIL Image for pytesseract
            pil_image = Image.fromarray(image)
            
            # Extract text
            text_data = pytesseract.image_to_data(pil_image, output_type=pytesseract.Output.DICT)
            
            # Filter and process text
            filtered_text = []
            confidences = []
            
            for i in range(len(text_data['text'])):
                if int(text_data['conf'][i]) > 30:
                    text = text_data['text'][i].strip()
                    if text:
                        filtered_text.append(text)
                        confidences.append(int(text_data['conf'][i]))
            
            extracted_text = ' '.join(filtered_text)
            avg_confidence = np.mean(confidences) if confidences else 0.0
            cleaned_text = self.clean_extracted_text(extracted_text)
            
            return {
                "success": True,
                "extracted_text": cleaned_text,
                "raw_text": extracted_text,
                "confidence": avg_confidence,
                "word_count": len(cleaned_text.split()),
                "processing_method": "enhanced_preprocessing" if preprocess else "direct_extraction"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "extracted_text": "",
                "confidence": 0.0
            }
    
    def clean_extracted_text(self, text: str) -> str:
        """Clean and normalize extracted text."""
        if not text:
            return ""
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters that might interfere with search
        text = re.sub(r'[^\w\s\-.,!?]', '', text)
        
        # Normalize common OCR errors
        text = text.replace('0', 'O')  # Zero to O
        text = text.replace('1', 'I')  # One to I where appropriate
        
        # Remove standalone single characters that are likely OCR errors
        words = text.split()
        cleaned_words = []
        for word in words:
            if len(word) > 1 or word.lower() in ['a', 'i']:
                cleaned_words.append(word)
        
        return ' '.join(cleaned_words).strip()
    
    def extract_handwritten_text(self, image_path: str) -> Dict[str, Any]:
        """Specialized extraction for handwritten text."""
        try:
            image = cv2.imread(image_path)
            if image is None:
                return {
                    "success": False,
                    "error": "Unable to load image",
                    "extracted_text": "",
                    "confidence": 0.0
                }
            
            # Special preprocessing for handwritten text
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Apply adaptive threshold for handwritten text
            adaptive_thresh = cv2.adaptiveThreshold(
                gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
            )
            
            # Convert to PIL Image
            pil_image = Image.fromarray(adaptive_thresh)
            
            # Use specific configuration for handwritten text
            custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 '
            
            extracted_text = pytesseract.image_to_string(pil_image, config=custom_config)
            
            # Get confidence
            text_data = pytesseract.image_to_data(pil_image, output_type=pytesseract.Output.DICT)
            confidences = [int(conf) for conf in text_data['conf'] if int(conf) > 0]
            avg_confidence = np.mean(confidences) if confidences else 0.0
            
            cleaned_text = self.clean_extracted_text(extracted_text)
            
            return {
                "success": True,
                "extracted_text": cleaned_text,
                "raw_text": extracted_text,
                "confidence": avg_confidence,
                "word_count": len(cleaned_text.split()),
                "processing_method": "handwritten_optimized"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "extracted_text": "",
                "confidence": 0.0
            }
    
    def get_text_orientation(self, image_path: str) -> Dict[str, Any]:
        """Detect text orientation and correct if needed."""
        try:
            image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
            pil_image = Image.fromarray(image)
            
            # Get orientation information
            osd = pytesseract.image_to_osd(pil_image)
            
            # Parse orientation info
            orientation_info = {}
            for line in osd.split('\n'):
                if ':' in line:
                    key, value = line.split(':', 1)
                    orientation_info[key.strip()] = value.strip()
            
            return {
                "success": True,
                "orientation_info": orientation_info
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "orientation_info": {}
            }
    
    def batch_extract_text(self, image_paths: List[str]) -> List[Dict[str, Any]]:
        """Extract text from multiple images."""
        results = []
        for image_path in image_paths:
            result = self.extract_text_from_image(image_path)
            result['image_path'] = image_path
            results.append(result)
        return results