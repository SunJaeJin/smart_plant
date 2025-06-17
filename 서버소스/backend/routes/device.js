const express = require('express')
const multer = require('multer')
const path = require('path')
const bcrypt = require('bcrypt')
const { spawn } =  require('child_process')
const router = express.Router()
const dbPool = require('./db')

function ensureLoggedIn(req, res, next) {
    // 세션에서 user_ID 가져오기 전에 세션 유효성 검사
    if (!req.session || !req.session.user || !req.session.user.user_ID) {
        return res.status(401).json({ message: 'User not logged in' });
    }
    next()
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, '/home/t24107/v1.0src/backend/uploads')
    },
    filename: function(req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

// 작은따옴표로 묶인 JSON 문자열을 유효한 JSON으로 변환하는 함수
function convertToValidJSON(inputString) {
    return inputString.replace(/'/g, '"');
}

// 디바이스 등록 및 초기 상태 및 자동 모드 설정
router.post('/', ensureLoggedIn, async (req, res) => {
    // JSON 문자열을 유효한 JSON으로 변환
    const jsonString = convertToValidJSON(req.body.data);
    let data;

    try {
        data = JSON.parse(jsonString);
    } catch (error) {
        return res.status(400).json({ message: 'Invalid JSON data: ' + error.message });
    }

    const { mac, name, info } = data;
    const user_ID = req.session.user.user_ID;

    // 필수 필드 확인
    if (!mac || !name) {
        return res.status(400).json({ message: 'Missing required fields: mac and name are required' });
    }

    try {
        // 데이터베이스에 디바이스 정보 삽입
        const [deviceResult] = await dbPool.query(
            `INSERT INTO Devices (mac, name, user_ID, info) VALUES (?, ?, ?, ?)`,
            [mac, name, user_ID, info || '']
        );

        // 기본 설정 상태를 'on'로 설정
        const types = ['LED', 'Humidifier', 'Cooling Fan'];
        for (const type of types) {
            await dbPool.query(
                `INSERT INTO ManualDeviceSettings (user_ID, device_type, state) VALUES (?, ?, 'off')`,
                [user_ID, type]
            );
        }

        // SystemAutoMode 테이블에 자동 모드 'on' 설정
        await dbPool.query(
            `INSERT INTO SystemAutoMode (user_ID, mode) VALUES (?, 'on')`,
            [user_ID]
        );

        res.status(201).json({ message: 'Device added successfully and auto mode set to on', deviceId: deviceResult.insertId });
    } catch (error) {
        console.error('Error adding device and initializing system auto mode:', error);
        res.status(500).json({ message: 'Error adding device and system auto mode', error });
    }
});

//디바이스 등록 여부 확인
router.get('/check-device', ensureLoggedIn, async (req, res) => {
    const user_ID = req.session.user.user_ID

    try {
        const [result] = await dbPool.query(
            `SELECT * FROM Devices WHERE user_ID = ?`,
            [user_ID]
        )

        if (result.length > 0) {
            res.json({ hasDevice: true })
        } else {
            res.json({ hasDevice: false })
        }
    } catch (error) {
        console.error('Error checking for user\'s device:', error);
        res.status(500).json({ message: 'Error checking for user\'s device', error });
    }
})

//디바이스 mac 주소 불러오기
router.get('/mac-address', ensureLoggedIn, async (req, res) => {
    const user_ID = req.session.user.user_ID

    try {
        // 해당 사용자의 모든 디바이스 MAC 주소를 조회합니다.
        const [devices] = await dbPool.query(
            'SELECT mac FROM Devices WHERE user_ID = ?',
            [user_ID]
        );

        if (devices.length > 0) {
            // 조회된 MAC 주소 목록을 반환합니다.
            res.json({ mac: devices[0].mac })
        } else {
            // 디바이스가 없을 경우 빈 배열을 반환합니다.
            res.status(404).json({ message: 'No devices found' });
        }
    } catch (error) {
        console.error('Error retrieving MAC addresses:', error);
        res.status(500).json({ message: 'Error retrieving MAC addresses', error });
    }
})

//촬영된 식물 사진 추가
router.post('/photo', upload.single('photo'), async (req, res) => {
    if(!req.file) {
        return res.status(400).json({ message: 'No photo uploaded' })
    }

    const { mac } = req.body
    const photoPath = req.file.path

    console.log(req.body, req.file.path)
    try {

        const [user] = await dbPool.query(
            `SELECT user_ID FROM Devices WHERE mac = ?`,
            [mac]
        );

        const userId = user[0] ? user[0].user_ID : null; // user_ID가 있는지 확인

        const [result] = await dbPool.query(
            `INSERT INTO Device_photos (mac, photo, user_ID) VALUES (?, ?, ?)`,
            [mac, photoPath, userId]
        )

        const pythonProcess = spawn('python', ['/home/t24107/v1.0src/ai/predict.py', photoPath])
        let scriptOutPut = ''

        pythonProcess.stdout.on('data', (data) => {
            scriptOutPut += data.toString()
            console.log(data.toString())
        });

        pythonProcess.stderr.on('data', (data) => {
            // python 프로그램 오류 내용
            // console.error(`stderr: ${data}`);
        });

        pythonProcess.on('close', async (code) => {
            const aiResult = scriptOutPut.trim()
            const processedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')

            if (code == 0) {
                console.error(`Python script process exited with code ${code}`);
                await dbPool.query(
                    `UPDATE Device_photos SET error_log = ? WHERE photo_ID = ?`,
                    [`Python script exited with code ${code}`, result.insertId]
                )

                return res.status(500).json({ message: 'Error executing Python script' })
            }

            try {
                await dbPool.query(
                    `UPDATE Device_photos SET ai_result = ?, processed_at = ? WHERE photo_ID = ?`,
                    [aiResult, processedAt, result.insertId]
                )
                res.status(201).json({
                    message: 'Photo uploaded and AI prediction completed successfully',
                    plantId: result.insertId,
                    aiOutput: aiResult // AI 예측 결과 추가
                });
            } catch (error) {
                console.error('Error updating AI result in the database:', error);
                res.status(500).json({ message: 'Error updating AI result in the database', error });
            }
        })
    } catch (error) {
        console.error('Error uploading photo:', error);
        res.status(500).json({ message: 'Error uploading photo', error });
    }
})

// 디바이스에 등록된 식물이 있는지 확인
router.get('/check-plants', ensureLoggedIn, async (req, res) => {
    const user_ID = req.session.user.user_ID; // 세션에서 user_ID 가져오기

    try {
        const [plants] = await dbPool.query('SELECT * FROM User_Plants WHERE user_ID = ?', [user_ID]);

        if (plants.length > 0) {
            res.json({ hasPlants: true });
        } else {
            res.json({ hasPlants: false });
        }
    } catch (error) {
        console.error('Error checking for plants:', error);
        res.status(500).json({ message: 'Error checking for plants', error });
    }
});


// 최신 사진의 AI 판별 결과 가져오기
router.get('/latest-photo-result', ensureLoggedIn, async (req, res) => {
    const user_ID = req.session.user.user_ID;

    try {
        const [latestPhoto] = await dbPool.query(`
            SELECT * FROM Device_photos
            WHERE user_ID = ?
            ORDER BY processed_at DESC
            LIMIT 1
        `, [user_ID]);

        if (latestPhoto.length > 0) {
            res.json({ latestResult: latestPhoto[0] });
        } else {
            res.status(404).json({ message: 'No photos found' });
        }
    } catch (error) {
        console.error('Error retrieving the latest photo result:', error);
        res.status(500).json({ message: 'Error retrieving the latest photo result', error });
    }
});

// 디바이스 상세 정보 조회 라우터
router.get('/details/:deviceId', ensureLoggedIn, async (req, res) => {
    const deviceId = req.params.deviceId; // URL로부터 디바이스 ID를 추출합니다.

    try {
        // 디바이스 정보 조회 쿼리 실행
        const [device] = await dbPool.query('SELECT * FROM Devices WHERE device_ID = ?', [deviceId]);
        
        if (device.length === 0) {
            return res.status(404).json({ message: 'Device not found' });
        }
        
        // 조회된 디바이스 정보 반환
        res.json({ device: device[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving device details' });
    }
});

// 디바이스 닉네임 변경
router.patch('/update-name', ensureLoggedIn, async (req, res) => {
    const user_ID = req.session.user.user_ID;
    const { device_ID, newName } = req.body;

    if (!newName) {
        return res.status(400).json({ message: 'New name is required' });
    }

    try {
        // 소유권 확인
        const [device] = await dbPool.query('SELECT * FROM Devices WHERE device_ID = ? AND user_ID = ?', [device_ID, user_ID]);
        if (device.length === 0) {
            return res.status(404).json({ message: 'Device not found or you do not own this device' });
        }

        // 이름 업데이트
        await dbPool.query('UPDATE Devices SET name = ? WHERE device_ID = ?', [newName, device_ID]);
        res.status(200).json({ message: 'Device name updated successfully' });
    } catch (error) {
        console.error('Error updating device name:', error);
        res.status(500).json({ message: 'Error updating device name', error });
    }
});

//디바이스 삭제
router.delete('/:mac', ensureLoggedIn, async (req, res) => {
    const { password } = req.body; // 비밀번호를 요청 본문에서 가져옵니다.
    const mac = req.params.mac;
    const user_ID = req.session.user.user_ID;

    if (!user_ID) {
        return res.status(401).json({ message: 'Unauthorized: User not logged in' });
    }

    // 사용자의 비밀번호가 맞는지 확인합니다.
    try {
        const [user] = await dbPool.query('SELECT password FROM Users WHERE user_ID = ?', [user_ID]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // bcrypt를 사용하여 저장된 해시와 입력된 비밀번호를 비교합니다.
        const passwordIsValid = await bcrypt.compare(password, user[0].password);
        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // 디바이스 소유권 확인
        const [device] = await dbPool.query('SELECT user_ID FROM Devices WHERE mac = ?', [mac]);
        if (device.length === 0) {
            return res.status(404).json({ message: 'Device not found' });
        }

        if (device[0].user_ID !== user_ID) {
            return res.status(403).json({ message: 'Forbidden: You do not own this device' });
        }

        // 디바이스와 연관된 식물 데이터 삭제
        await dbPool.query('DELETE FROM User_Plants WHERE user_ID = ?', [user_ID]);
        // 디바이스와 연관된 사진 데이터를 삭제
        await dbPool.query('DELETE FROM Device_photos WHERE mac = ?', [mac]);
        // 디바이스와 연관된 모듈 작동 상태 데이터를 삭제
        await dbPool.query('DELETE FROM ManualDeviceSettings WHERE user_ID = ?', [user_ID]);
        await dbPool.query('DELETE FROM SystemAutoMode WHERE user_ID = ?', [user_ID]);
        await dbPool.query('DELETE FROM DeviceAutoSettings WHERE user_ID = ?', [user_ID]);
        // 센서로그 및 엑츄에이터 로그 데이터 삭제
        await dbPool.query('DELETE FROM SensorLogs WHERE user_ID = ?', [user_ID]);
        await dbPool.query('DELETE FROM ActuatorLogs WHERE user_ID = ?', [user_ID]);
        //디바이스 삭제
        const result = await dbPool.query('DELETE FROM Devices WHERE mac = ?', [mac]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No device found with the given MAC address' });
        }

        res.json({ message: 'Device and all related data deleted successfully' });
    } catch (error) {
        console.error('Error deleting the device:', error);
        res.status(500).json({ message: 'Error deleting the device and related data', error });
    }
});

// 수동 설정 상태 조회
router.get('/manual-settings/:device_type', ensureLoggedIn, async (req, res) => {
    const user_ID = req.session.user.user_ID;
    const { device_type } = req.params;

    try {
        const query = `
            SELECT state, intensity
            FROM ManualDeviceSettings
            WHERE user_ID = ? AND device_type = ?;
        `;
        const [settings] = await dbPool.query(query, [user_ID, device_type]);
        if (settings.length) {
            res.status(200).json(settings[0]);
        } else {
            res.status(404).json({ message: 'No settings found for the specified device' });
        }
    } catch (error) {
        console.error('Error retrieving manual device settings:', error);
        res.status(500).json({ message: 'Error retrieving manual device settings', error });
    }
});

// 모듈 수동 설정
router.patch('/manual-settings/:device_type', ensureLoggedIn, async (req, res) => {
    const user_ID = req.session.user.user_ID;
    const { device_type } = req.params;
    const { state, intensity } = req.body;

    if (!state) {
        return res.status(400).json({ message: 'State is required' });
    }

    try {
        const query = `
            UPDATE ManualDeviceSettings
            SET state = ?, intensity = ?
            WHERE user_ID = ? AND device_type = ?;
        `;
        await dbPool.query(query, [state, intensity || null, user_ID, device_type]);
        res.status(200).json({ message: 'Manual device setting updated successfully' });
    } catch (error) {
        console.error('Error updating manual device setting:', error);
        res.status(500).json({ message: 'Error updating manual device setting', error });
    }
});

// 자동 모드 활성화/비활성화
router.patch('/auto-mode-toggle', ensureLoggedIn, async (req, res) => {
    const user_ID = req.session.user.user_ID;
    const { mode } = req.body; // 클라이언트에서 'on' 또는 'off' 상태 받음

    if (!mode) {
        return res.status(400).json({ message: 'Mode is required' });
    }

    try {
        const query = `
            UPDATE SystemAutoMode
            SET mode = ?
            WHERE user_ID = ?;
        `;
        await dbPool.query(query, [mode, user_ID]);
        res.status(200).json({ message: `Auto mode has been turned ${mode}` });
    } catch (error) {
        console.error(`Error toggling auto mode:`, error);
        res.status(500).json({ message: `Error toggling auto mode`, error });
    }
});

module.exports = router;