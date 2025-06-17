import json
import sys
import os
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.resnet50 import preprocess_input, decode_predictions
from tensorflow.keras.models import load_model

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

def classify_image(model_path, labels, img_array):
    model = load_model(model_path)
    predictions = model.predict(img_array, verbose=0)
    max_index = predictions.argmax(axis=1)[0]
    label_name = labels[str(max_index)]
    return label_name

def main(image_path):
    # 모델과 레이블 파일 경로
    with open('aidata/model_version.txt', 'r', encoding='utf-8') as f:
        version = f.read()
        # print(version)
    
    model_path = f"aidata/models/{version}.h5"
    labels_path = f"aidata/labels/{version}.json"

    labels = load_labels(labels_path)
    img_array = load_image(image_path)

    # 이미지 분류 및 결과 출력
    result = classify_image(model_path, labels, img_array)
    print(result)
    exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(0)
    image_path = sys.argv[1]

    main(image_path)