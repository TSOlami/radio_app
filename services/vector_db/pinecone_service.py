import os
import time
from typing import List, Dict, Any, Tuple
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pinecone import Pinecone, ServerlessSpec
import json

class PineconeVectorService:
    def __init__(self, api_key: str = None, environment: str = "us-east-1-aws"):
        self.api_key = api_key or os.getenv('PINECONE_API_KEY', 'your-pinecone-api-key')
        self.environment = environment
        self.pc = None
        self.index = None
        self.index_name = "ecommerce-products"
        self.vectorizer = TfidfVectorizer(max_features=384, stop_words='english')
        self.products_df = None
        
    def initialize_pinecone(self):
        """Initialize Pinecone client."""
        try:
            self.pc = Pinecone(api_key=self.api_key)
            print("Pinecone client initialized successfully")
            return True
        except Exception as e:
            print(f"Failed to initialize Pinecone: {e}")
            print("Using local similarity search as fallback")
            return False
    
    def create_index(self, dimension: int = 384):
        """Create a Pinecone index."""
        try:
            if self.pc is None:
                self.initialize_pinecone()
            
            # Check if index already exists
            existing_indexes = self.pc.list_indexes()
            if self.index_name in [idx.name for idx in existing_indexes]:
                print(f"Index {self.index_name} already exists")
                self.index = self.pc.Index(self.index_name)
                return True
            
            # Create new index
            self.pc.create_index(
                name=self.index_name,
                dimension=dimension,
                metric="cosine",
                spec=ServerlessSpec(
                    cloud="aws",
                    region=self.environment
                )
            )
            
            # Wait for index to be ready
            while not self.pc.describe_index(self.index_name).status['ready']:
                time.sleep(1)
            
            self.index = self.pc.Index(self.index_name)
            print(f"Index {self.index_name} created successfully")
            return True
            
        except Exception as e:
            print(f"Failed to create index: {e}")
            return False
    
    def generate_product_vectors(self, products_df: pd.DataFrame) -> np.ndarray:
        """Generate TF-IDF vectors for products."""
        self.products_df = products_df.copy()
        
        # Create combined text for vectorization
        combined_text = (
            products_df['Description'].fillna('') + ' ' +
            products_df['StockCode'].fillna('') + ' ' +
            products_df['Country'].fillna('')
        ).str.lower()
        
        # Generate TF-IDF vectors
        vectors = self.vectorizer.fit_transform(combined_text)
        return vectors.toarray()
    
    def upsert_products(self, products_df: pd.DataFrame):
        """Upload product vectors to Pinecone."""
        try:
            if self.index is None and not self.create_index():
                print("Using local storage as fallback")
                return False
            
            vectors = self.generate_product_vectors(products_df)
            
            # Prepare data for upsert
            upsert_data = []
            for i, (_, row) in enumerate(products_df.iterrows()):
                metadata = {
                    'stock_code': str(row['StockCode']),
                    'description': str(row['Description']),
                    'unit_price': float(row['UnitPrice']),
                    'country': str(row['Country'])
                }
                
                upsert_data.append({
                    'id': f"product_{i}",
                    'values': vectors[i].tolist(),
                    'metadata': metadata
                })
            
            # Upsert in batches
            batch_size = 100
            for i in range(0, len(upsert_data), batch_size):
                batch = upsert_data[i:i + batch_size]
                if self.index:
                    self.index.upsert(batch)
                else:
                    # Store locally as fallback
                    self._store_locally(batch)
            
            print(f"Uploaded {len(upsert_data)} product vectors")
            return True
            
        except Exception as e:
            print(f"Failed to upsert products: {e}")
            return False
    
    def _store_locally(self, data: List[Dict]):
        """Store vectors locally as fallback."""
        os.makedirs('data/vectors', exist_ok=True)
        with open('data/vectors/products.json', 'a') as f:
            for item in data:
                f.write(json.dumps(item) + '\n')
    
    def search_similar_products(self, query: str, top_k: int = 5) -> List[Dict]:
        """Search for similar products using the query."""
        try:
            # Generate query vector
            query_vector = self.vectorizer.transform([query.lower()])
            
            if self.index:
                # Use Pinecone search
                results = self.index.query(
                    vector=query_vector.toarray()[0].tolist(),
                    top_k=top_k,
                    include_metadata=True
                )
                
                return [
                    {
                        'id': match['id'],
                        'score': match['score'],
                        'metadata': match['metadata']
                    }
                    for match in results['matches']
                ]
            else:
                # Use local similarity search
                return self._local_similarity_search(query, top_k)
                
        except Exception as e:
            print(f"Search failed: {e}")
            return self._local_similarity_search(query, top_k)
    
    def _local_similarity_search(self, query: str, top_k: int = 5) -> List[Dict]:
        """Local similarity search as fallback."""
        if self.products_df is None:
            return []
        
        try:
            # Generate query vector
            query_vector = self.vectorizer.transform([query.lower()])
            
            # Generate product vectors
            product_vectors = self.generate_product_vectors(self.products_df)
            
            # Calculate similarities
            similarities = cosine_similarity(query_vector, product_vectors)[0]
            
            # Get top k results
            top_indices = np.argsort(similarities)[::-1][:top_k]
            
            results = []
            for idx in top_indices:
                if similarities[idx] > 0.1:  # Minimum similarity threshold
                    row = self.products_df.iloc[idx]
                    results.append({
                        'id': f"product_{idx}",
                        'score': float(similarities[idx]),
                        'metadata': {
                            'stock_code': str(row['StockCode']),
                            'description': str(row['Description']),
                            'unit_price': float(row['UnitPrice']),
                            'country': str(row['Country'])
                        }
                    })
            
            return results
            
        except Exception as e:
            print(f"Local search failed: {e}")
            return []
    
    def get_similarity_metrics(self) -> Dict[str, str]:
        """Get information about similarity metrics used."""
        return {
            "primary_metric": "cosine_similarity",
            "vectorization": "tf_idf",
            "features": "384_dimensional",
            "description": "Cosine similarity on TF-IDF vectors for product descriptions and metadata",
            "fallback_metric": "local_cosine_similarity",
            "justification": "Cosine similarity works well for text-based product matching as it measures the angle between vectors, making it ideal for document similarity regardless of magnitude."
        }
    
    def delete_index(self):
        """Delete the Pinecone index."""
        try:
            if self.pc and self.index_name:
                self.pc.delete_index(self.index_name)
                print(f"Index {self.index_name} deleted")
        except Exception as e:
            print(f"Failed to delete index: {e}")
    
    def get_index_stats(self) -> Dict:
        """Get index statistics."""
        try:
            if self.index:
                stats = self.index.describe_index_stats()
                return {
                    'total_vectors': stats.get('total_vector_count', 0),
                    'index_fullness': stats.get('index_fullness', 0),
                    'dimension': stats.get('dimension', 384)
                }
        except Exception as e:
            print(f"Failed to get stats: {e}")
        
        return {'status': 'using_local_fallback'}