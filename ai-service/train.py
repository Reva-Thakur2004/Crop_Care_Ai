"""
AgriVision AI - CNN Training script (PlantVillage dataset)
This script demonstrates how to train a convolutional neural network for crop disease classification.

Expected Dataset Directory Structure:
dataset/
    tomato_healthy/
        image1.jpg
        image2.jpg
    tomato_bacterial_spot/
        image1.jpg
        ...
    potato_early_blight/
        ...
"""

import os
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2

# Define constants
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10
DATASET_DIR = "dataset/" # Replace with path to PlantVillage dataset

def build_model(num_classes):
    # Load MobileNetV2 base model with ImageNet weights, excluding top fully-connected layers
    base_model = MobileNetV2(
        weights='imagenet',
        include_top=False,
        input_shape=(224, 224, 3)
    )
    
    # Freeze the base model layers
    base_model.trainable = False
    
    # Build CNN classification layers on top of base model
    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(256, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.2),
        layers.Dense(num_classes, activation='softmax') # Softmax returns probabilities
    ])
    
    # Compile the model
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def train():
    if not os.path.exists(DATASET_DIR):
        print(f"Error: Dataset directory '{DATASET_DIR}' not found.")
        print("To train a real model, please structure your PlantVillage images into folder categories and set DATASET_DIR.")
        return

    # Image Data Generators with Data Augmentation
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        validation_split=0.2 # 20% validation split
    )

    # Load Train Data
    train_generator = train_datagen.flow_from_directory(
        DATASET_DIR,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training'
    )

    # Load Validation Data
    validation_generator = train_datagen.flow_from_directory(
        DATASET_DIR,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation'
    )

    # Print Class Mapping details
    class_indices = train_generator.class_indices
    print("Class mappings found in dataset:")
    for class_name, index in class_indices.items():
        print(f"  {class_name} -> Index {index}")

    # Build model
    num_classes = len(class_indices)
    model = build_model(num_classes)
    model.summary()

    # Train model
    print("Starting training...")
    history = model.fit(
        train_generator,
        steps_per_epoch=train_generator.samples // BATCH_SIZE,
        validation_data=validation_generator,
        validation_steps=validation_generator.samples // BATCH_SIZE,
        epochs=EPOCHS
    )

    # Save trained model to keras format
    model.save("crop_model.keras")
    print("Model successfully trained and saved as 'crop_model.keras'")

if __name__ == "__main__":
    train()
