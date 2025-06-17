const express = require('express');
const router = express.Router();
const dbPool = require('./db');
const multer = require('multer');
const path = require('path');
const getImageCount = require('../../ai/get_image_count');
const getCurrentAIVersion = require('../../ai/get_current_ai_version');
const updateAIVersion = require('../../ai/update_ai_version');
const addDataset = require('../../ai/add_dataset');
const runTrain = require('../../ai/run_train');

// 관리자 로그인 상태 확인 미들웨어
function ensureAdminLoggedIn(req, res, next) {
    if (!req.session.admin || !req.session.admin.admin_ID) {
        return res.status(401).json({ message: 'Access denied: Admin not logged in' });
    }
    next();
}

// AI 모델 목록 조회
router.get('/ai_models', ensureAdminLoggedIn, async (req, res) => {
    try {
        const query = "SELECT * FROM AI_models ORDER BY model_ID DESC";
        const [models] = await dbPool.query(query);
        res.status(200).json(models);
    } catch (error) {
        console.error('Error retrieving AI models:', error);
        res.status(500).json({ message: 'Error retrieving AI models', error: error.message });
    }
});

// 모든 AI 모델의 성능(accuracy) 조회
router.get('/ai_model_accuracies', ensureAdminLoggedIn, async (req, res) => {
    try {
        const query = "SELECT model_ID, version, accuracy FROM AI_models ORDER BY model_ID DESC";
        const [models] = await dbPool.query(query);
        res.status(200).json(models);
    } catch (error) {
        console.error('Error retrieving AI model accuracies:', error);
        res.status(500).json({ message: 'Error retrieving AI model accuracies', error: error.message });
    }
});

// 학습용 데이터셋 조회
// http://ceprj.gachon.ac.kr:60007/api/ai/ai_dataset_info
router.get('/ai_dataset_info', ensureAdminLoggedIn, async (req, res) => {
    try {
        const datasetInfo = getImageCount()
        res.status(200).json(datasetInfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error read dataset info' });
    }
});

// 현재 사용중인 AI 모델의 버전 조회
// http://ceprj.gachon.ac.kr:60007/api/ai/current_ai_version
router.get('/current_ai_version', ensureAdminLoggedIn, async (req, res) => {
    getCurrentAIVersion()
    .then(version => {
        console.log(version);
        res.status(200).send(version);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Error rea d current ai version' });
    });
});

// 사용할 AI 모델의 버전 변경 
// http://ceprj.gachon.ac.kr:60007/api/ai/current_ai_version
router.put('/current_ai_version', ensureAdminLoggedIn, async (req, res) => {
    const { version } = req.body; // 요청의 body에서 버전 정보 추출
    try {
        // updateAIVersion 함수 호출하여 버전 정보 업데이트
        await updateAIVersion(version);
        res.status(200).send('AI version updated successfully.');
    } catch (error) {
        console.error('Error updating AI version:', error);
        res.status(500).send('Internal server error.');
    }
});

// AI 데이터셋에 식물 이미지 추가
// http://ceprj.gachon.ac.kr:60007/api/ai/ai_dataset
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      // cb(null, path.join(__dirname, '../ai_uploads'))
      cb(null, '/home/t24107/v1.0src/backend/ai_uploads')
    },
    filename: function(req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

router.post('/ai_dataset', upload.array('images'), async (req, res) => {
    try {
        const imagePaths = req.files.map(file => file.path); // 전달받은 이미지들의 경로를 imagePaths에 배열로 저장
        const isForTest = req.body.isForTest === 'true'; // 테스트데이터에 추가할지 여부, boolean값으로 변환
        const plantName = req.body.plantName; // 전달받은 식물 이름

        const success = await addDataset(imagePaths, isForTest, plantName);

        if (success) {
            res.status(200).send('Image saved successfully.');
        } else {
            res.status(500).send('Image save failed.');
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('Internal server error.');
    }
});

// AI 학습 후 모델정보 DB에 저장
// http://ceprj.gachon.ac.kr:60007/api/ai/train_model
router.post('/train_model', (req, res) => {
    const { version, batchSize, numEpochs, numPatience, description } = req.body;

    runTrain(version, batchSize, numEpochs, numPatience, description)
        .then((modelPerformance) => {
            res.status(200).send(`모델 "${version}"의 학습이 완료되었습니다. (정확도 : ${modelPerformance})`);
        })
        .catch((error) => {
            console.error('Model training error:', error);
            res.status(500).send(`모델 "${version}"의 학습에 실패했습니다: (${error.message})`);
        });
});

module.exports = router;