import os
import json
import sys
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.resnet50 import preprocess_input

def load_labels(labels_path):
    with open(labels_path, 'r', encoding='utf-8') as f:
        labels = json.load(f)
    return labels

def load_image(image_path):
    img = image.load_img(image_path, target_size=(224,224))
    img_array = image.img_to_array(img)
    img_array = preprocess_input(img_array)
    img_array = img_array.reshape((1,) + img_array.shape)
    return img_array

def classify_image(model, labels, img_array):
    predictions = model.predict(img_array, verbose=0)
    max_index = predictions.argmax(axis=1)[0]
    label_name = labels[str(max_index)]
    return label_name, predictions[0][max_index]

def classify_images_in_directory(directory):
    files = os.listdir(directory)

    with open('aidata/model_version.txt', 'r', encoding='utf-8') as f:
        version = f.read()
    
    model_path = f"aidata/models/{version}.h5"
    labels_path = f"aidata/labels/{version}.json"
    labels = load_labels(labels_path)
    model = load_model(model_path)

    for file in files:
        if file.endswith('.jpg') or file.endswith('.jpeg') or file.endswith('.png'):
            image_path = os.path.join(directory, file)
            img_array = load_image(image_path)
            result, probability = classify_image(model, labels, img_array)
            print(f"{file}: {result} ({probability*100:.2f}%)")

if __name__ == "__main__":
    # 이미지 파일이 있는 디렉터리 경로
    directory = 'aidata/test'
    classify_images_in_directory(directory)