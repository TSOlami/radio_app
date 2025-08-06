# Product Recommendation System - Demo Instructions

## How to Run the Project

### Prerequisites
- Python 3.8 or higher
- pip package manager

### Installation & Setup

1. **Install Dependencies**
```bash
pip install --break-system-packages -r requirements.txt
```

2. **Run the Application**
```bash
python app.py
```

3. **Access the Application**
Open your browser and go to: `http://localhost:5000`

## Demo Test Queries

### Text Query Questions (for /text-query page):

**Original queries provided:** *(These may not return results as the dataset contains home decor/gift items, not clothing/computers)*
- "Looking for a T-shirt"
- "Suggest some Antiques"  
- "Is there any teapot available?"
- "I want to buy some computer accessories."

**Working demo queries:** *(These will return actual results from the dataset)*
- "heart decoration"
- "tea accessories" 
- "christmas decorations"
- "kitchen items"
- "white lantern"
- "bags"

### How to Test:
1. Go to `http://localhost:5000`
2. Click "Text Search" 
3. Enter one of the test queries above
4. Click "Search Products"

## Why Pinecone was Chosen

**Task 2 Requirement:** "Set up a vector database using Pinecone to store product vectors"

The README specifically required Pinecone for the vector database implementation. Key reasons:

1. **Specified in Requirements**: The task explicitly mentioned "using Pinecone"
2. **Vector Search Optimization**: Pinecone is designed specifically for similarity search
3. **Scalability**: Handles large-scale vector operations efficiently  
4. **Integration**: Good Python SDK for easy integration

**Fallback Implementation**: The system includes local JSON storage as fallback when Pinecone API is unavailable, ensuring the demo works without requiring API keys.

## System Architecture

### Core Components:
- **Data Cleaning**: Processes e-commerce dataset (541K→528K records)
- **Vector Database**: TF-IDF vectors with cosine similarity 
- **OCR Service**: Tesseract-based text extraction
- **CNN Model**: Product image classification (requires training)
- **Web Interface**: Basic HTML forms for testing

### API Endpoints:
- `POST /product-recommendation` - Text search
- `POST /ocr-query` - Image text extraction  
- `POST /image-product-search` - Product image recognition
- `GET /service-status` - System status
- `GET /dataset-summary` - Dataset information

## Dataset Information
- **Original Records**: 541,909
- **Cleaned Records**: 528,697  
- **Unique Products**: 7,580
- **Date Range**: Dec 2010 - Dec 2011
- **Countries**: 38

## Notes for Demo
- The system works with the cleaned dataset for text searches
- OCR functionality is implemented but needs images with text
- CNN model is implemented but requires training data
- Vector search uses local fallback (no Pinecone API key needed)
- All core functionality works offline