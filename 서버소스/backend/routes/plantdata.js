const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const dbPool = require('./db');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/home/t24107/v1.0src/backend/plantdata')  // 저장 경로를 /plantdata 폴더로 설정
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))  // 파일명은 현재 시간과 원본 파일의 확장자로 생성
    }
});

const upload = multer({ storage: storage })

// 식물 데이터 추가 (사진 포함)
router.post('/plants', upload.single('photo'), async (req, res) => {
    const { name, scientific_name, description, watering, temperature, humidity, light_demand } = req.body;
    const photo = req.file ? `/plantdata/${req.file.filename}` : '';  // 업로드된 파일 경로 저장

    try {
        const query = `
            INSERT INTO Plantdata (photo, name, scientific_name, description, watering, temperature, humidity, light_demand)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `;
        const values = [photo, name, scientific_name, description, watering, temperature, humidity, light_demand];
        const [result] = await dbPool.query(query, values);
        res.status(201).json({ message: 'Plant added successfully', plantdata_ID: result.insertId });
    } catch (error) {
        console.error('Error adding plant data:', error);
        res.status(500).json({ message: 'Error adding plant data', error: error.message });
    }
});

// 식물 데이터 조회
router.get('/plants', async (req, res) => {
    try {
        const [plants] = await dbPool.query('SELECT * FROM Plantdata');
        res.json(plants);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving plants' });
    }
});

// 특정 식물 데이터 조회
router.get('/plants/:plantdata_ID', async (req, res) => {
    try {
        const [plant] = await dbPool.query('SELECT * FROM Plantdata WHERE plantdata_ID = ?', [req.params.plantdata_ID]);
        if (plant.length > 0) {
            res.json(plant[0]);
        } else {
            res.status(404).json({ message: 'Plant not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving plant' });
    }
});

// 특정 식물 데이터 조회(식물이름)
router.get('/plants/name/:name', async (req, res) => {

    console.log("GET 요청 성공")
    try {
        const [plant] = await dbPool.query('SELECT * FROM Plantdata WHERE name = ?', [req.params.name]);
        if (plant.length > 0) {
            res.json(plant[0]);
        } else {
            res.status(404).json({ message: 'Plant not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving plant' });
    }
});

// 매칭된 식물 정보 가져오기
router.get('/match-plant', async (req, res) => {
    const user_ID = req.session.user.user_ID;
    const aiResult = req.query.aiResult; // AI 판별 결과로 예상되는 식물 이름

    if (!user_ID || !aiResult) {
        return res.status(400).json({ message: 'Missing user ID or AI result' });
    }

    try {
        const [matchedPlant] = await dbPool.query(`
            SELECT * FROM Plantdata
            WHERE name = ?
        `, [aiResult]);

        if (matchedPlant.length > 0) {
            res.json(matchedPlant[0]);
        } else {
            res.status(404).json({ message: 'No matching plant found' });
        }
    } catch (error) {
        console.error('Error matching plant data:', error);
        res.status(500).json({ message: 'Error matching plant data', error });
    }
});

// 식물 데이터 수정
router.put('/plants/:plantdata_ID', async (req, res) => {
    const { photo, name, scientific_name, description, care_instruction } = req.body;
    try {
        const query = `
            UPDATE Plantdata SET
            photo = ?, 
            name = ?, 
            scientific_name = ?, 
            description = ?, 
            care_instruction = ?
            WHERE plantdata_ID = ?;
        `;
        const values = [photo, name, scientific_name, description, care_instruction, req.params.plantdata_ID];
        const [result] = await dbPool.query(query, values);
        if (result.affectedRows > 0) {
            res.json({ message: 'Plant updated successfully' });
        } else {
            res.status(404).json({ message: 'Plant not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating plant data' });
    }
});

// 식물 데이터 삭제
router.delete('/plants/:plantdata_ID', async (req, res) => {
    try {
        const [result] = await dbPool.query('DELETE FROM Plantdata WHERE plantdata_ID = ?', [req.params.plantdata_ID]);
        if (result.affectedRows > 0) {
            res.json({ message: 'Plant deleted successfully' });
        } else {
            res.status(404).json({ message: 'Plant not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting plant data' });
    }
});

module.exports = router;
