import pandas as pd
import numpy as np
import re
from typing import Tuple, List
import warnings
warnings.filterwarnings('ignore')

class DataCleaner:
    def __init__(self):
        self.cleaned_dataset = None
        self.original_shape = None
        self.cleaned_shape = None
        
    def load_dataset(self, file_path: str) -> pd.DataFrame:
        """Load the e-commerce dataset."""
        df = pd.read_csv(file_path)
        self.original_shape = df.shape
        return df
    
    def clean_text_columns(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean text columns by removing special characters and normalizing format."""
        df = df.copy()
        
        # Clean country names
        df['Country'] = df['Country'].str.replace(r'[^\w\s]', '', regex=True)
        df['Country'] = df['Country'].str.replace(r'XxY', '', regex=True)
        df['Country'] = df['Country'].str.strip()
        
        # Clean stock codes
        df['StockCode'] = df['StockCode'].str.replace(r'[^\w]', '', regex=True)
        
        # Clean invoice numbers
        df['InvoiceNo'] = df['InvoiceNo'].str.replace(r'[^\w]', '', regex=True)
        
        # Clean descriptions
        df['Description'] = df['Description'].fillna('Unknown Product')
        df['Description'] = df['Description'].str.replace(r'[^\w\s]', ' ', regex=True)
        df['Description'] = df['Description'].str.strip()
        
        return df
    
    def clean_numeric_columns(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean and convert numeric columns."""
        df = df.copy()
        
        # Clean quantity
        df['Quantity'] = df['Quantity'].astype(str).str.replace(r'[^\d.-]', '', regex=True)
        df['Quantity'] = pd.to_numeric(df['Quantity'], errors='coerce')
        
        # Clean unit price
        df['UnitPrice'] = df['UnitPrice'].astype(str).str.replace(r'[^\d.-]', '', regex=True)
        df['UnitPrice'] = pd.to_numeric(df['UnitPrice'], errors='coerce')
        
        # Clean customer ID
        df['CustomerID'] = df['CustomerID'].astype(str).str.replace(r'[^\d.]', '', regex=True)
        df['CustomerID'] = pd.to_numeric(df['CustomerID'], errors='coerce')
        
        # Remove negative quantities and prices
        df = df[(df['Quantity'] > 0) & (df['UnitPrice'] > 0)]
        
        return df
    
    def handle_missing_values(self, df: pd.DataFrame) -> pd.DataFrame:
        """Handle missing values in the dataset."""
        df = df.copy()
        
        # Fill missing descriptions
        df['Description'] = df['Description'].fillna('Unknown Product')
        
        # For CustomerID, we'll keep NaN values as they might represent guest purchases
        # But for analysis, we can fill them with a default value
        df['CustomerID'] = df['CustomerID'].fillna(-1)
        
        return df
    
    def remove_duplicates(self, df: pd.DataFrame) -> pd.DataFrame:
        """Remove duplicate records."""
        initial_count = len(df)
        df = df.drop_duplicates()
        final_count = len(df)
        print(f"Removed {initial_count - final_count} duplicate records")
        return df
    
    def standardize_formats(self, df: pd.DataFrame) -> pd.DataFrame:
        """Standardize data formats."""
        df = df.copy()
        
        # Standardize date format
        df['InvoiceDate'] = pd.to_datetime(df['InvoiceDate'], errors='coerce')
        
        # Standardize country names
        df['Country'] = df['Country'].str.title()
        
        # Standardize descriptions
        df['Description'] = df['Description'].str.upper()
        
        return df
    
    def clean_dataset(self, file_path: str) -> pd.DataFrame:
        """Main method to clean the entire dataset."""
        print("Loading dataset...")
        df = self.load_dataset(file_path)
        print(f"Original dataset shape: {df.shape}")
        
        print("Cleaning text columns...")
        df = self.clean_text_columns(df)
        
        print("Cleaning numeric columns...")
        df = self.clean_numeric_columns(df)
        
        print("Handling missing values...")
        df = self.handle_missing_values(df)
        
        print("Removing duplicates...")
        df = self.remove_duplicates(df)
        
        print("Standardizing formats...")
        df = self.standardize_formats(df)
        
        # Remove rows with critical missing data
        df = df.dropna(subset=['InvoiceDate', 'Quantity', 'UnitPrice'])
        
        self.cleaned_dataset = df
        self.cleaned_shape = df.shape
        print(f"Cleaned dataset shape: {df.shape}")
        
        return df
    
    def save_cleaned_dataset(self, output_path: str):
        """Save the cleaned dataset."""
        if self.cleaned_dataset is not None:
            self.cleaned_dataset.to_csv(output_path, index=False)
            print(f"Cleaned dataset saved to {output_path}")
        else:
            print("No cleaned dataset to save. Run clean_dataset() first.")
    
    def get_dataset_summary(self) -> dict:
        """Get summary statistics of the cleaned dataset."""
        if self.cleaned_dataset is None:
            return {"error": "No cleaned dataset available"}
        
        df = self.cleaned_dataset
        return {
            "total_records": len(df),
            "unique_products": df['StockCode'].nunique(),
            "unique_customers": df['CustomerID'].nunique(),
            "date_range": {
                "start": df['InvoiceDate'].min().strftime('%Y-%m-%d'),
                "end": df['InvoiceDate'].max().strftime('%Y-%m-%d')
            },
            "countries": df['Country'].nunique(),
            "total_revenue": (df['Quantity'] * df['UnitPrice']).sum(),
            "data_quality": {
                "missing_descriptions": df['Description'].isna().sum(),
                "missing_customer_ids": df['CustomerID'].isna().sum(),
                "records_removed": self.original_shape[0] - self.cleaned_shape[0] if self.original_shape else 0
            }
        }