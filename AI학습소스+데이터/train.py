import os
import math
import json
import tensorflow as tf
import sys
import evaluate_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, LearningRateScheduler

# 이름, 경로 설정
model_id = ""
labels_save_path = "aidata/labels/"
model_save_path = "aidata/models/"
dataset_dir = 'aidata/dataset_train'

# 하이퍼파라미터 설정
initial_lr = 0.00001
batch_size = 32
num_epochs = 50
dropout_ratio = 0.5
num_patience = 5

def create_model(num_classes):
    """ResNet50 모델 생성 및 커스터마이즈"""
    base_model = ResNet50(include_top=False, weights='imagenet', input_shape=(224, 224, 3))
    x = GlobalAveragePooling2D()(base_model.output)
    x = Dense(1024, activation='relu')(x)
    x = Dropout(dropout_ratio)(x)
    predictions = Dense(num_classes, activation='softmax')(x)
    model = Model(inputs=base_model.input, outputs=predictions)

    for layer in base_model.layers[-50:]:
        layer.trainable = True

    model.compile(optimizer=Adam(lr=initial_lr), loss='categorical_crossentropy', metrics=['accuracy'])
    return model

def setup_data_generators(dataset_dir):
    """데이터 제너레이터 설정"""
    train_datagen = ImageDataGenerator(
        preprocessing_function=preprocess_input,
        rotation_range=40,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        brightness_range=[0.8, 1.2], 
        channel_shift_range=20,
        validation_split=0.2  
    )

    train_generator = train_datagen.flow_from_directory(
        dataset_dir,
        target_size=(224, 224),
        batch_size=batch_size,
        class_mode='categorical',
        subset='training', 
    )

    validation_generator = train_datagen.flow_from_directory(
        dataset_dir,
        target_size=(224, 224),
        batch_size=batch_size,
        class_mode='categorical',
        subset='validation',
        shuffle=False
    )

    return train_generator, validation_generator

def save_class_indices(train_generator):
    """클래스 인덱스 JSON 파일로 저장, 키와 값의 위치를 바꿔서 저장"""
    class_indices = train_generator.class_indices
    reversed_indices = {str(value): key for key, value in class_indices.items()}
    
    with open(labels_save_path, 'w', encoding='utf-8') as f:
        json.dump(reversed_indices, f, ensure_ascii=False, indent=4)

def train_model(model, train_generator, validation_generator):
    """모델 훈련"""
    lr_scheduler = LearningRateScheduler(lambda epoch: initial_lr * math.pow(0.5, math.floor((1+epoch)/10.0)))
    checkpoints = ModelCheckpoint(model_save_path, monitor='val_accuracy', save_best_only=True, verbose=1)
    early_stop = EarlyStopping(monitor='val_loss', patience=num_patience, verbose=1)

    model.fit(
        train_generator,
        steps_per_epoch=train_generator.samples // train_generator.batch_size,
        epochs=num_epochs,
        verbose=1,
        validation_data=validation_generator,
        validation_steps=validation_generator.samples // validation_generator.batch_size,
        callbacks=[checkpoints, early_stop, lr_scheduler]
    )

def main():    
    global model_id, batch_size, num_epochs, num_patience, labels_save_path, model_save_path
    
    model_id = sys.argv[1]
    batch_size = int(sys.argv[2])
    num_epochs = int(sys.argv[3])
    num_patience = int(sys.argv[4])
    
    model_save_path += model_id + ".h5"
    labels_save_path += model_id + ".json"
    
    train_generator, validation_generator = setup_data_generators(dataset_dir)
    model = create_model(num_classes=len(train_generator.class_indices))
    save_class_indices(train_generator)
    train_model(model, train_generator, validation_generator)
    # model.load_weights(model_save_path)
    # loss, accuracy = model.evaluate(validation_generator)
    # print("Validation Accuracy: {:.2f}%".format(accuracy * 100))
    print("F1 score :", evaluate_model.evaluate_f1_score(model_save_path))

if __name__ == '__main__':
    main()