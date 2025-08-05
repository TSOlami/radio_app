import os
import numpy as np
import pandas as pd
import cv2
from typing import List, Dict, Tuple, Optional, Any
import json
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models, optimizers, callbacks
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.utils import to_categorical
import pickle

class CNNTrainer:
    def __init__(self, image_dir: str = "data/scraped_images", img_size: Tuple[int, int] = (224, 224)):
        self.image_dir = image_dir
        self.img_size = img_size
        self.model = None
        self.class_names = []
        self.num_classes = 0
        self.history = None
        self.model_path = "services/cnn_model/trained_model.h5"
        self.classes_path = "services/cnn_model/classes.json"
        
        # Ensure model directory exists
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        
    def load_and_preprocess_data(self) -> Tuple[np.ndarray, np.ndarray, List[str]]:
        """Load and preprocess images from the scraped dataset."""
        print("Loading and preprocessing data...")
        
        images = []
        labels = []
        class_names = []
        
        if not os.path.exists(self.image_dir):
            print(f"Image directory {self.image_dir} not found!")
            return np.array([]), np.array([]), []
        
        # Get all product categories (subdirectories)
        categories = [d for d in os.listdir(self.image_dir) 
                     if os.path.isdir(os.path.join(self.image_dir, d))]
        
        if not categories:
            print("No image categories found!")
            return np.array([]), np.array([]), []
        
        print(f"Found {len(categories)} product categories")
        
        # Create class mapping
        class_names = sorted(categories)
        class_to_idx = {class_name: idx for idx, class_name in enumerate(class_names)}
        
        # Load images for each category
        for class_name in class_names:
            class_dir = os.path.join(self.image_dir, class_name)
            class_images = [f for f in os.listdir(class_dir) 
                           if f.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp'))]
            
            print(f"Loading {len(class_images)} images for class: {class_name}")
            
            for img_file in class_images:
                img_path = os.path.join(class_dir, img_file)
                
                # Load and preprocess image
                image = self.preprocess_image(img_path)
                if image is not None:
                    images.append(image)
                    labels.append(class_to_idx[class_name])
        
        if not images:
            print("No valid images found!")
            return np.array([]), np.array([]), []
        
        # Convert to numpy arrays
        X = np.array(images, dtype=np.float32) / 255.0  # Normalize to [0, 1]
        y = np.array(labels)
        
        print(f"Loaded {len(X)} images across {len(class_names)} classes")
        print(f"Image shape: {X.shape}")
        
        return X, y, class_names
    
    def preprocess_image(self, img_path: str) -> Optional[np.ndarray]:
        """Preprocess a single image."""
        try:
            # Load image
            image = cv2.imread(img_path)
            if image is None:
                return None
            
            # Convert BGR to RGB
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Resize image
            image = cv2.resize(image, self.img_size, interpolation=cv2.INTER_AREA)
            
            # Apply basic augmentation for better generalization
            # Random brightness adjustment
            if np.random.random() > 0.5:
                brightness = np.random.uniform(0.8, 1.2)
                image = np.clip(image * brightness, 0, 255)
            
            return image.astype(np.uint8)
            
        except Exception as e:
            print(f"Error preprocessing image {img_path}: {e}")
            return None
    
    def create_cnn_model(self, input_shape: Tuple[int, int, int], num_classes: int) -> keras.Model:
        """Create CNN model from scratch."""
        model = models.Sequential([
            # First Convolutional Block
            layers.Conv2D(32, (3, 3), activation='relu', input_shape=input_shape),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.25),
            
            # Second Convolutional Block
            layers.Conv2D(64, (3, 3), activation='relu'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.25),
            
            # Third Convolutional Block
            layers.Conv2D(128, (3, 3), activation='relu'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.25),
            
            # Fourth Convolutional Block
            layers.Conv2D(256, (3, 3), activation='relu'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.25),
            
            # Global Average Pooling instead of Flatten to reduce overfitting
            layers.GlobalAveragePooling2D(),
            
            # Dense layers
            layers.Dense(512, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.5),
            
            layers.Dense(256, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.5),
            
            # Output layer
            layers.Dense(num_classes, activation='softmax')
        ])
        
        return model
    
    def train_model(self, X: np.ndarray, y: np.ndarray, validation_split: float = 0.2, 
                   epochs: int = 50, batch_size: int = 32) -> Dict[str, Any]:
        """Train the CNN model."""
        if len(X) == 0 or len(y) == 0:
            return {"error": "No training data available"}
        
        # Convert labels to categorical
        y_categorical = to_categorical(y, num_classes=self.num_classes)
        
        # Split data
        X_train, X_val, y_train, y_val = train_test_split(
            X, y_categorical, test_size=validation_split, random_state=42, stratify=y
        )
        
        print(f"Training set: {X_train.shape[0]} samples")
        print(f"Validation set: {X_val.shape[0]} samples")
        
        # Create model
        input_shape = (self.img_size[0], self.img_size[1], 3)
        self.model = self.create_cnn_model(input_shape, self.num_classes)
        
        # Compile model
        self.model.compile(
            optimizer=optimizers.Adam(learning_rate=0.001),
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        print("Model architecture:")
        self.model.summary()
        
        # Data augmentation
        train_datagen = ImageDataGenerator(
            rotation_range=20,
            width_shift_range=0.2,
            height_shift_range=0.2,
            horizontal_flip=True,
            zoom_range=0.2,
            shear_range=0.2,
            fill_mode='nearest'
        )
        
        val_datagen = ImageDataGenerator()  # No augmentation for validation
        
        # Callbacks
        callbacks_list = [
            callbacks.EarlyStopping(
                monitor='val_loss',
                patience=10,
                restore_best_weights=True
            ),
            callbacks.ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.2,
                patience=5,
                min_lr=0.0001
            ),
            callbacks.ModelCheckpoint(
                self.model_path,
                monitor='val_accuracy',
                save_best_only=True,
                mode='max'
            )
        ]
        
        # Train model
        print("Starting training...")
        self.history = self.model.fit(
            train_datagen.flow(X_train, y_train, batch_size=batch_size),
            steps_per_epoch=len(X_train) // batch_size,
            epochs=epochs,
            validation_data=val_datagen.flow(X_val, y_val, batch_size=batch_size),
            validation_steps=len(X_val) // batch_size,
            callbacks=callbacks_list,
            verbose=1
        )
        
        # Evaluate model
        val_loss, val_accuracy = self.model.evaluate(X_val, y_val, verbose=0)
        
        # Make predictions for detailed evaluation
        y_pred = self.model.predict(X_val)
        y_pred_classes = np.argmax(y_pred, axis=1)
        y_true_classes = np.argmax(y_val, axis=1)
        
        # Generate classification report
        class_report = classification_report(
            y_true_classes, y_pred_classes, 
            target_names=self.class_names, output_dict=True
        )
        
        training_results = {
            "final_val_loss": float(val_loss),
            "final_val_accuracy": float(val_accuracy),
            "num_epochs_trained": len(self.history.history['loss']),
            "num_classes": self.num_classes,
            "total_parameters": self.model.count_params(),
            "classification_report": class_report,
            "class_names": self.class_names
        }
        
        # Save class names
        self.save_class_names()
        
        print(f"Training completed! Final validation accuracy: {val_accuracy:.4f}")
        return training_results
    
    def train_from_scraped_data(self, epochs: int = 50, batch_size: int = 32) -> Dict[str, Any]:
        """Complete training pipeline from scraped data."""
        # Load and preprocess data
        X, y, class_names = self.load_and_preprocess_data()
        
        if len(X) == 0:
            return {"error": "No training data found. Please run web scraping first."}
        
        self.class_names = class_names
        self.num_classes = len(class_names)
        
        # Check if we have enough data per class
        unique, counts = np.unique(y, return_counts=True)
        min_samples = min(counts)
        
        if min_samples < 10:
            print(f"Warning: Some classes have very few samples (minimum: {min_samples})")
            print("Consider scraping more images for better performance")
        
        # Train model
        return self.train_model(X, y, epochs=epochs, batch_size=batch_size)
    
    def load_trained_model(self) -> bool:
        """Load a previously trained model."""
        try:
            if os.path.exists(self.model_path):
                self.model = keras.models.load_model(self.model_path)
                
                # Load class names
                if os.path.exists(self.classes_path):
                    with open(self.classes_path, 'r') as f:
                        self.class_names = json.load(f)
                    self.num_classes = len(self.class_names)
                
                print("Model loaded successfully")
                return True
            else:
                print("No trained model found")
                return False
        except Exception as e:
            print(f"Error loading model: {e}")
            return False
    
    def predict_image(self, image_path: str) -> Dict[str, Any]:
        """Predict the class of a single image."""
        if self.model is None:
            if not self.load_trained_model():
                return {"error": "No trained model available"}
        
        try:
            # Preprocess image
            image = self.preprocess_image(image_path)
            if image is None:
                return {"error": "Could not load image"}
            
            # Normalize and add batch dimension
            image = np.expand_dims(image.astype(np.float32) / 255.0, axis=0)
            
            # Make prediction
            predictions = self.model.predict(image, verbose=0)
            predicted_class_idx = np.argmax(predictions[0])
            confidence = float(predictions[0][predicted_class_idx])
            
            # Get top 3 predictions
            top_3_idx = np.argsort(predictions[0])[::-1][:3]
            top_3_predictions = [
                {
                    "class": self.class_names[idx],
                    "confidence": float(predictions[0][idx])
                }
                for idx in top_3_idx
            ]
            
            return {
                "predicted_class": self.class_names[predicted_class_idx],
                "confidence": confidence,
                "top_3_predictions": top_3_predictions,
                "all_class_probabilities": {
                    self.class_names[i]: float(predictions[0][i]) 
                    for i in range(len(self.class_names))
                }
            }
            
        except Exception as e:
            return {"error": str(e)}
    
    def predict_from_bytes(self, image_bytes: bytes) -> Dict[str, Any]:
        """Predict the class of an image from bytes."""
        if self.model is None:
            if not self.load_trained_model():
                return {"error": "No trained model available"}
        
        try:
            # Convert bytes to numpy array
            nparr = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if image is None:
                return {"error": "Could not decode image"}
            
            # Convert BGR to RGB and resize
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            image = cv2.resize(image, self.img_size, interpolation=cv2.INTER_AREA)
            
            # Normalize and add batch dimension
            image = np.expand_dims(image.astype(np.float32) / 255.0, axis=0)
            
            # Make prediction
            predictions = self.model.predict(image, verbose=0)
            predicted_class_idx = np.argmax(predictions[0])
            confidence = float(predictions[0][predicted_class_idx])
            
            return {
                "predicted_class": self.class_names[predicted_class_idx],
                "confidence": confidence,
                "all_class_probabilities": {
                    self.class_names[i]: float(predictions[0][i]) 
                    for i in range(len(self.class_names))
                }
            }
            
        except Exception as e:
            return {"error": str(e)}
    
    def save_class_names(self):
        """Save class names to JSON file."""
        try:
            with open(self.classes_path, 'w') as f:
                json.dump(self.class_names, f)
        except Exception as e:
            print(f"Error saving class names: {e}")
    
    def plot_training_history(self, save_path: str = "notebooks/training_history.png"):
        """Plot training history."""
        if self.history is None:
            print("No training history available")
            return
        
        plt.figure(figsize=(12, 4))
        
        # Plot accuracy
        plt.subplot(1, 2, 1)
        plt.plot(self.history.history['accuracy'], label='Training Accuracy')
        plt.plot(self.history.history['val_accuracy'], label='Validation Accuracy')
        plt.title('Model Accuracy')
        plt.xlabel('Epoch')
        plt.ylabel('Accuracy')
        plt.legend()
        
        # Plot loss
        plt.subplot(1, 2, 2)
        plt.plot(self.history.history['loss'], label='Training Loss')
        plt.plot(self.history.history['val_loss'], label='Validation Loss')
        plt.title('Model Loss')
        plt.xlabel('Epoch')
        plt.ylabel('Loss')
        plt.legend()
        
        plt.tight_layout()
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        plt.savefig(save_path)
        plt.close()
        print(f"Training history saved to {save_path}")
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the trained model."""
        if self.model is None:
            if not self.load_trained_model():
                return {"error": "No trained model available"}
        
        return {
            "num_classes": len(self.class_names),
            "class_names": self.class_names,
            "input_shape": self.model.input_shape[1:],
            "total_parameters": self.model.count_params(),
            "model_exists": os.path.exists(self.model_path)
        }