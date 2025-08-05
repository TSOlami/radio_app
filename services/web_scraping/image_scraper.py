import requests
import os
import time
import json
from urllib.parse import urljoin, urlparse
from typing import List, Dict, Optional, Tuple, Any
import pandas as pd
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import cv2
import numpy as np
from PIL import Image
import io

class ImageScraper:
    def __init__(self, download_dir: str = "data/scraped_images"):
        self.download_dir = download_dir
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
        self.driver = None
        
        # Create download directory
        os.makedirs(self.download_dir, exist_ok=True)
        
        # Load stock codes from CNN training data
        self.stock_codes = self.load_cnn_training_products()
        
    def load_cnn_training_products(self) -> List[str]:
        """Load stock codes from CNN_Model_Train_Data.csv."""
        try:
            df = pd.read_csv('data/CNN_Model_Train_Data.csv')
            stock_codes = df['StockCode'].astype(str).str.replace(r'[^\w]', '', regex=True).tolist()
            print(f"Loaded {len(stock_codes)} stock codes for CNN training")
            return stock_codes
        except Exception as e:
            print(f"Error loading CNN training data: {e}")
            return []
    
    def setup_selenium_driver(self, headless: bool = True) -> bool:
        """Setup Selenium WebDriver for dynamic content scraping."""
        try:
            chrome_options = Options()
            if headless:
                chrome_options.add_argument("--headless")
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--disable-gpu")
            chrome_options.add_argument("--window-size=1920,1080")
            
            self.driver = webdriver.Chrome(options=chrome_options)
            return True
        except Exception as e:
            print(f"Failed to setup Selenium driver: {e}")
            return False
    
    def search_google_images(self, query: str, max_images: int = 20) -> List[str]:
        """Search Google Images for product images."""
        image_urls = []
        try:
            if not self.driver and not self.setup_selenium_driver():
                return image_urls
            
            search_url = f"https://www.google.com/search?q={query}&tbm=isch"
            self.driver.get(search_url)
            
            # Wait for images to load
            time.sleep(2)
            
            # Scroll to load more images
            for _ in range(3):
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(1)
            
            # Find image elements
            img_elements = self.driver.find_elements(By.CSS_SELECTOR, "img[data-src], img[src]")
            
            for img in img_elements[:max_images]:
                img_url = img.get_attribute("data-src") or img.get_attribute("src")
                if img_url and img_url.startswith("http") and "googleusercontent" in img_url:
                    image_urls.append(img_url)
            
        except Exception as e:
            print(f"Error searching Google Images: {e}")
        
        return image_urls
    
    def search_bing_images(self, query: str, max_images: int = 20) -> List[str]:
        """Search Bing Images for product images."""
        image_urls = []
        try:
            if not self.driver and not self.setup_selenium_driver():
                return image_urls
            
            search_url = f"https://www.bing.com/images/search?q={query}"
            self.driver.get(search_url)
            
            time.sleep(2)
            
            # Scroll to load more images
            for _ in range(3):
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(1)
            
            img_elements = self.driver.find_elements(By.CSS_SELECTOR, "img.mimg")
            
            for img in img_elements[:max_images]:
                img_url = img.get_attribute("src")
                if img_url and img_url.startswith("http"):
                    image_urls.append(img_url)
                    
        except Exception as e:
            print(f"Error searching Bing Images: {e}")
        
        return image_urls
    
    def download_image(self, url: str, filename: str, category: str) -> bool:
        """Download image from URL."""
        try:
            category_dir = os.path.join(self.download_dir, category)
            os.makedirs(category_dir, exist_ok=True)
            
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            # Validate image
            if not self.is_valid_image(response.content):
                return False
            
            filepath = os.path.join(category_dir, filename)
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            # Resize image if needed
            self.resize_image_if_needed(filepath)
            return True
            
        except Exception as e:
            print(f"Error downloading image {url}: {e}")
            return False
    
    def is_valid_image(self, content: bytes) -> bool:
        """Validate if content is a valid image."""
        try:
            # Check minimum size
            if len(content) < 1024:  # 1KB minimum
                return False
            
            # Try to open with PIL
            image = Image.open(io.BytesIO(content))
            
            # Check dimensions
            width, height = image.size
            if width < 100 or height < 100:
                return False
            
            # Check aspect ratio
            aspect_ratio = width / height
            if aspect_ratio > 5 or aspect_ratio < 0.2:
                return False
            
            return True
            
        except Exception:
            return False
    
    def resize_image_if_needed(self, filepath: str, target_size: Tuple[int, int] = (224, 224)):
        """Resize image if it's too large for training."""
        try:
            image = cv2.imread(filepath)
            if image is None:
                return
            
            height, width = image.shape[:2]
            
            # Only resize if image is significantly larger
            if width > target_size[0] * 2 or height > target_size[1] * 2:
                resized = cv2.resize(image, target_size, interpolation=cv2.INTER_AREA)
                cv2.imwrite(filepath, resized)
                
        except Exception as e:
            print(f"Error resizing image {filepath}: {e}")
    
    def generate_search_queries(self, stock_code: str, description: str = "") -> List[str]:
        """Generate search queries for a product."""
        queries = []
        
        # Basic stock code query
        queries.append(f"product {stock_code}")
        
        if description:
            # Clean description
            clean_desc = description.replace(",", " ").replace("-", " ").lower()
            words = clean_desc.split()
            
            # Use first few words
            if len(words) >= 2:
                queries.append(" ".join(words[:3]))
            
            # Add product-specific queries
            queries.append(f"{description} product")
            queries.append(f"buy {description}")
        
        # Generic product queries
        queries.extend([
            f"ecommerce product {stock_code}",
            f"retail product {stock_code}",
        ])
        
        return queries[:3]  # Limit to 3 queries per product
    
    def scrape_product_images(self, stock_code: str, description: str = "", images_per_product: int = 30) -> Dict[str, Any]:
        """Scrape images for a specific product."""
        result = {
            "stock_code": stock_code,
            "description": description,
            "images_downloaded": 0,
            "sources": [],
            "errors": []
        }
        
        try:
            # Generate search queries
            queries = self.generate_search_queries(stock_code, description)
            
            downloaded_count = 0
            for query in queries:
                if downloaded_count >= images_per_product:
                    break
                
                print(f"Searching for: {query}")
                
                # Search multiple sources
                google_urls = self.search_google_images(query, max_images=15)
                bing_urls = self.search_bing_images(query, max_images=15)
                
                all_urls = list(set(google_urls + bing_urls))  # Remove duplicates
                
                # Download images
                for i, url in enumerate(all_urls):
                    if downloaded_count >= images_per_product:
                        break
                    
                    filename = f"{stock_code}_{downloaded_count + 1}.jpg"
                    
                    if self.download_image(url, filename, stock_code):
                        downloaded_count += 1
                        result["sources"].append({
                            "url": url,
                            "filename": filename,
                            "query": query
                        })
                    else:
                        result["errors"].append(f"Failed to download: {url}")
                    
                    time.sleep(0.5)  # Rate limiting
            
            result["images_downloaded"] = downloaded_count
            print(f"Downloaded {downloaded_count} images for {stock_code}")
            
        except Exception as e:
            result["errors"].append(str(e))
            print(f"Error scraping images for {stock_code}: {e}")
        
        return result
    
    def scrape_all_cnn_products(self, images_per_product: int = 50) -> Dict[str, Any]:
        """Scrape images for all products in CNN training data."""
        if not self.stock_codes:
            return {"error": "No stock codes loaded"}
        
        # Load main dataset for descriptions
        try:
            main_df = pd.read_csv('data/dataset.csv')
            main_df['StockCode'] = main_df['StockCode'].astype(str).str.replace(r'[^\w]', '', regex=True)
        except Exception as e:
            print(f"Could not load main dataset: {e}")
            main_df = pd.DataFrame()
        
        results = {
            "total_products": len(self.stock_codes),
            "processed": 0,
            "total_images": 0,
            "product_results": [],
            "errors": []
        }
        
        for i, stock_code in enumerate(self.stock_codes):
            print(f"\nProcessing {i+1}/{len(self.stock_codes)}: {stock_code}")
            
            # Get description if available
            description = ""
            if not main_df.empty:
                product_rows = main_df[main_df['StockCode'] == stock_code]
                if not product_rows.empty:
                    description = str(product_rows.iloc[0]['Description'])
            
            # Scrape images
            product_result = self.scrape_product_images(stock_code, description, images_per_product)
            results["product_results"].append(product_result)
            results["total_images"] += product_result["images_downloaded"]
            results["processed"] += 1
            
            # Save progress periodically
            if i % 5 == 0:
                self.save_scraping_progress(results)
            
            time.sleep(1)  # Rate limiting between products
        
        self.save_scraping_progress(results)
        return results
    
    def save_scraping_progress(self, results: Dict[str, Any]):
        """Save scraping progress to JSON file."""
        try:
            with open(os.path.join(self.download_dir, 'scraping_progress.json'), 'w') as f:
                json.dump(results, f, indent=2)
        except Exception as e:
            print(f"Error saving progress: {e}")
    
    def get_dataset_statistics(self) -> Dict[str, Any]:
        """Get statistics about the scraped dataset."""
        stats = {
            "categories": {},
            "total_images": 0,
            "average_images_per_category": 0
        }
        
        try:
            for category in os.listdir(self.download_dir):
                category_path = os.path.join(self.download_dir, category)
                if os.path.isdir(category_path):
                    image_count = len([f for f in os.listdir(category_path) 
                                     if f.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp'))])
                    stats["categories"][category] = image_count
                    stats["total_images"] += image_count
            
            if stats["categories"]:
                stats["average_images_per_category"] = stats["total_images"] / len(stats["categories"])
            
        except Exception as e:
            stats["error"] = str(e)
        
        return stats
    
    def cleanup(self):
        """Clean up resources."""
        if self.driver:
            self.driver.quit()
        self.session.close()
    
    def __del__(self):
        """Destructor to clean up resources."""
        self.cleanup()