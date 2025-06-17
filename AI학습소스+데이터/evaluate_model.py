import json
import numpy as np
from sklearn.metrics import f1_score
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.resnet50 import preprocess_input

def evaluate_f1_score(model_path):
    test_data_dir = 'aidata/dataset_test'
    model_path = model_path

    test_datagen = ImageDataGenerator(preprocessing_function=preprocess_input)

    test_generator = test_datagen.flow_from_directory(
        test_data_dir,
        target_size=(224, 224),
        batch_size=32,
        class_mode='categorical',
        shuffle=False,
    )

    model = load_model(model_path)

    y_true = test_generator.classes
    y_pred_prob = model.predict(test_generator)

    y_pred = np.argmax(y_pred_prob, axis=1)

    # 성능 측정
    f1 = f1_score(y_true, y_pred, average='weighted')
    return round(f1, 2)