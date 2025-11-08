#!/usr/bin/env python3

import requests
import base64
import json
import cv2
import numpy as np

def create_test_image():
    """Create a simple test image with a basic face-like pattern"""
    # Create a 200x200 test image
    img = np.zeros((200, 200, 3), dtype=np.uint8)
    
    # Fill with a skin-like color
    img[:, :] = [200, 180, 160]
    
    # Add simple face features (eyes, nose, mouth)
    # Eyes
    cv2.circle(img, (60, 70), 10, (0, 0, 0), -1)  # Left eye
    cv2.circle(img, (140, 70), 10, (0, 0, 0), -1)  # Right eye
    
    # Nose
    cv2.circle(img, (100, 100), 5, (150, 130, 110), -1)
    
    # Mouth
    cv2.ellipse(img, (100, 140), (20, 10), 0, 0, 180, (100, 50, 50), -1)
    
    return img

def test_add_person():
    """Test the add person functionality"""
    print("Creating test image...")
    img = create_test_image()
    
    # Encode image to base64
    _, buffer = cv2.imencode('.jpg', img)
    img_base64 = base64.b64encode(buffer).decode('utf-8')
    img_data_url = f"data:image/jpeg;base64,{img_base64}"
    
    # Test data
    test_data = {
        "name": "Test Person",
        "image": img_data_url
    }
    
    print("Sending request to add person...")
    
    try:
        response = requests.post(
            'http://localhost:5001/api/add_person',
            json=test_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                print("✅ Add person test PASSED!")
                return True
            else:
                print(f"❌ Add person test FAILED: {result.get('message')}")
                return False
        else:
            print(f"❌ HTTP error: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Request failed: {e}")
        return False

def check_people_list():
    """Check if the person was added to the people list"""
    print("\nChecking people list...")
    
    try:
        response = requests.get('http://localhost:5001/api/people')
        if response.status_code == 200:
            people = response.json()
            print(f"Number of people in database: {len(people)}")
            if len(people) > 0:
                for person in people:
                    print(f"- {person.get('name', 'Unknown')} (ID: {person.get('id', 'N/A')})")
            return len(people) > 0
        else:
            print(f"Failed to get people list: {response.status_code}")
            return False
    except Exception as e:
        print(f"Error checking people list: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing Add Person Functionality")
    print("=" * 40)
    
    # Test adding a person
    add_success = test_add_person()
    
    # Check if person appears in the list
    list_success = check_people_list()
    
    print("\n" + "=" * 40)
    if add_success and list_success:
        print("✅ ALL TESTS PASSED - Add person functionality is working!")
    else:
        print("❌ TESTS FAILED - There are issues with add person functionality")
        if not add_success:
            print("  - Add person API call failed")
        if not list_success:
            print("  - Person was not added to the database")
