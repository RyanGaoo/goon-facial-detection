#!/usr/bin/env python3
"""
Test script to verify DeepFace detection is working
"""

import cv2
import numpy as np
import sys
sys.path.append('deepface-master')

from deepface import DeepFace

def test_detection():
    print("Testing DeepFace detection...")
    
    # Create a simple test image (black image with a white circle - won't detect a face, but will test the API)
    test_img = np.zeros((480, 640, 3), dtype=np.uint8)
    cv2.circle(test_img, (320, 240), 100, (255, 255, 255), -1)
    
    print(f"Test image shape: {test_img.shape}")
    
    try:
        print("\n1. Testing with enforce_detection=False...")
        results = DeepFace.analyze(
            test_img,
            actions=['emotion', 'age', 'gender'],
            enforce_detection=False,
            silent=False
        )
        print(f"Result type: {type(results)}")
        print(f"Results: {results}")
        
    except Exception as e:
        print(f"Error with enforce_detection=False: {e}")
        import traceback
        traceback.print_exc()
    
    # Now test with a real face image if available
    print("\n2. Testing with sample image from people_database...")
    import os
    people_db = "people_database"
    if os.path.exists(people_db):
        images = [f for f in os.listdir(people_db) if f.endswith('.png')]
        if images:
            sample_img_path = os.path.join(people_db, images[0])
            print(f"Loading image: {sample_img_path}")
            
            img = cv2.imread(sample_img_path)
            if img is not None:
                print(f"Image shape: {img.shape}")
                
                try:
                    results = DeepFace.analyze(
                        img,
                        actions=['emotion', 'age', 'gender'],
                        enforce_detection=False,
                        silent=False
                    )
                    print(f"Detection successful!")
                    print(f"Result type: {type(results)}")
                    if isinstance(results, list):
                        print(f"Number of faces detected: {len(results)}")
                        for i, result in enumerate(results):
                            print(f"\nFace {i+1}:")
                            print(f"  Region: {result.get('region', {})}")
                            print(f"  Emotion: {result.get('dominant_emotion', 'N/A')}")
                            print(f"  Age: {result.get('age', 'N/A')}")
                            print(f"  Gender: {result.get('dominant_gender', 'N/A')}")
                    else:
                        print(f"Single face detected:")
                        print(f"  Region: {results.get('region', {})}")
                        print(f"  Emotion: {results.get('dominant_emotion', 'N/A')}")
                        print(f"  Age: {results.get('age', 'N/A')}")
                        print(f"  Gender: {results.get('dominant_gender', 'N/A')}")
                        
                except Exception as e:
                    print(f"Error analyzing sample image: {e}")
                    import traceback
                    traceback.print_exc()
            else:
                print("Failed to load image")
        else:
            print("No images found in people_database")
    else:
        print("people_database directory not found")

if __name__ == "__main__":
    test_detection()
