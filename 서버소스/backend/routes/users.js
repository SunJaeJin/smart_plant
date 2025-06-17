const express = require('express')
const bcrypt = require('bcrypt')
const moment = require('moment')
const router = express.Router()
const dbPool = require('./db')

function ensureLoggedIn(req, res, next) {
    // 세션에서 user_ID 가져오기 전에 세션 유효성 검사
    if (!req.session || !req.session.user || !req.session.user.user_ID) {
        return res.status(401).json({ message: 'User not logged in' });
    }
    next()
}

//회원가입
router.post('/register', async (req, res) => {
    const { user_ID, password, name, gender, birth, email } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await dbPool.query(
            'INSERT INTO Users (user_ID, password, name, gender, birth, email, register_date, status) VALUES (?, ?, ?, ?, ?, ?, NOW(), "active")',
            [user_ID, hashedPassword, name, gender, birth, email]
        );
        res.status(201).json({ message: 'User registered', userId: user_ID });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// 로그인 라우터
router.post('/login', async (req, res) => {
    const { user_ID, password, rememberMe } = req.body;

    try {
        const [users] = await dbPool.query('SELECT * FROM Users WHERE user_ID = ?', [user_ID]);
        if (users.length > 0) {
            const user = users[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                // 세션에 사용자 정보 저장
                req.session.user = { user_ID: user.user_ID, name: user.name };

                if (rememberMe) {
                    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30일 동안 세션 유지
                }

                res.json({ message: 'Logged in successfully' });
            } else {
                res.status(401).json({ message: 'Invalid password' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

// 로그인 상태 확인 라우터
router.get('/check-login', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// 로그아웃 라우터
router.post('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).json({ message: 'Logout failed.', error: err });
            } else {
                res.status(200).json({ message: 'Logged out successfully.' });
            }
        });
    } else {
        res.status(200).json({ message: 'No session to terminate.' });
    }
});

//아이디 찾기
router.post('/find_id', async (req, res) => {
    const { email } = req.body;

    try {
        const [user] = await dbPool.query('SELECT user_ID FROM Users WHERE email = ?', [email]);
        if (user.length > 0) {
            res.json({ user_ID: user[0].user_ID });
        } else {
            res.status(404).json({ message: 'Email not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving username.' });
    }
});

//비밀번호 변경
router.post('/change-password', async (req, res) => {
    // 현재 비밀번호와 새로운 비밀번호를 요청 본문에서 추출합니다.
    const { currentPassword, newPassword } = req.body;
    const user_ID = req.session.user.user_ID; // 로그인한 사용자의 ID를 세션에서 가져옵니다.

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current and new password are required.' });
    }

    try {
        // 데이터베이스에서 사용자의 현재 비밀번호 해시를 검색합니다.
        const [users] = await dbPool.query('SELECT password FROM Users WHERE user_ID = ?', [user_ID]);
        if (users.length > 0) {
            const currentPasswordHash = users[0].password;

            // 현재 비밀번호가 맞는지 확인합니다.
            const match = await bcrypt.compare(currentPassword, currentPasswordHash);
            if (!match) {
                return res.status(401).json({ message: 'Current password is incorrect.' });
            }

            // 새로운 비밀번호를 해시하고 데이터베이스를 업데이트합니다.
            const newPasswordHash = await bcrypt.hash(newPassword, 10);
            await dbPool.query('UPDATE Users SET password = ? WHERE user_ID = ?', [newPasswordHash, user_ID]);

            res.json({ message: 'Password successfully changed.' });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error changing password.' });
    }
});

// 사용자 아이디와 이메일을 검증하는 라우터
router.post('/validate-user', async (req, res) => {
    const { user_ID, email } = req.body;

    if (!user_ID || !email) {
        return res.status(400).json({ message: 'User ID and email are required.' });
    }

    try {
        const [users] = await dbPool.query('SELECT * FROM Users WHERE user_ID = ? AND email = ?', [user_ID, email]);
        if (users.length > 0) {
            // 사용자 정보가 일치하면 성공 응답을 보냄
            res.status(200).json({ message: 'User validated successfully.' });
        } else {
            // 일치하는 사용자 정보가 없으면 오류 응답을 보냄
            res.status(404).json({ message: 'No matching user found.' });
        }
    } catch (error) {
        console.error('Error during user validation:', error);
        res.status(500).json({ message: 'Error validating user.' });
    }
});

// 비밀번호 재설정
router.post('/reset-password', async (req, res) => {
    const { user_ID, email, newPassword } = req.body;

    if (!user_ID || !email || !newPassword) {
        return res.status(400).json({ message: 'User ID, email, and new password are required.' });
    }

    try {
        // 데이터베이스에서 사용자 정보 검색
        const [users] = await dbPool.query('SELECT email FROM Users WHERE user_ID = ?', [user_ID]);
        if (users.length > 0) {
            const user = users[0];

            // 이메일이 데이터베이스의 기록과 일치하는지 확인
            if (user.email === email) {
                // 새 비밀번호 해시 생성
                const newPasswordHash = await bcrypt.hash(newPassword, 10);

                // 비밀번호 업데이트
                await dbPool.query('UPDATE Users SET password = ? WHERE user_ID = ?', [newPasswordHash, user_ID]);
                res.json({ message: 'Password successfully reset.' });
            } else {
                res.status(401).json({ message: 'Invalid email.' });
            }
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error resetting password.' });
    }
});


//회원탈퇴
router.delete('/delete-account', ensureLoggedIn, async (req, res) => {
    const { user_ID, password } = req.body;

    // 데이터베이스 연결 및 트랜잭션 시작
    const connection = await dbPool.getConnection();
    await connection.beginTransaction();

    try {
        // 사용자의 비밀번호 해시 가져오기
        const [users] = await connection.query('SELECT password FROM Users WHERE user_ID = ?', [user_ID]);
        if (users.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'User not found.' });
        }

        // 비밀번호 검증
        const isValid = await bcrypt.compare(password, users[0].password);
        if (!isValid) {
            await connection.rollback();
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Devices 테이블에서 해당 사용자의 모든 디바이스의 MAC 주소들을 먼저 조회
        const [devices] = await connection.query('SELECT mac FROM Devices WHERE user_ID = ?', [user_ID]);

        // 유저 식물 정보 삭제
        await dbPool.query('DELETE FROM User_Plants WHERE user_ID = ?', [user_ID]);
        // 각 디바이스에 연관된 Device_photos 삭제
        for (const device of devices) {
            await connection.query('DELETE FROM Device_photos WHERE mac = ?', [device.mac]);
        }

        // 연관된 Devices 데이터 삭제
        await connection.query('DELETE FROM Devices WHERE user_ID = ?', [user_ID]);
        await connection.query('DELETE FROM Inquiry_replies WHERE user_ID = ?', [user_ID]);
        await connection.query('DELETE FROM Inquiries WHERE user_ID = ?', [user_ID]);
        await connection.query('DELETE FROM Alerts WHERE user_ID = ?', [user_ID]);
        await connection.query('DELETE FROM SensorLogs WHERE user_ID = ?', [user_ID]);
        await connection.query('DELETE FROM ActuatorLogs WHERE user_ID = ?', [user_ID])
        await connection.query('DELETE FROM ManualDeviceSettings WHERE user_ID = ?', [user_ID]);
        await connection.query('DELETE FROM DeviceAutoSettings WHERE user_ID = ?', [user_ID]);
        await connection.query('DELETE FROM SystemAutoMode WHERE user_ID = ?', [user_ID]);

        // 사용자 계정 삭제
        const [deleteResult] = await connection.query('DELETE FROM Users WHERE user_ID = ?', [user_ID]);
        if (deleteResult.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'User not found.' });
        }

        // 트랜잭션 커밋
        await connection.commit();
        res.json({ message: 'Account successfully deleted.' });
    } catch (error) {
        // 에러 발생 시 롤백
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Error deleting account.', error });
    } finally {
        // 연결 해제
        connection.release();
    }
});

// 식물 등록 (photo_ID 선택적) 및 초기 자동 설정 추가
router.post('/register_plant_optional_photo', ensureLoggedIn, async (req, res) => {
    const { plantdata_ID: { plantdata_ID, user_ID, photo_ID, temperature, humidity, light_demand, watering } } = req.body;

    console.log(req.body)

    if (!user_ID || !plantdata_ID) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // 식물 정보 삽입
        const plantInsertQuery = `
            INSERT INTO User_Plants (user_ID, plantdata_ID, photo_ID)
            VALUES (?, ?, ?);
        `;
        await dbPool.query(plantInsertQuery, [user_ID, plantdata_ID, photo_ID || null]);

        // 자동 설정 초기화
        const autoSettingsInsertQuery = `
            INSERT INTO DeviceAutoSettings (user_ID, temp_range, humidity_range, light_intensity, watering_interval)
            VALUES (?, ?, ?, ?, ?);
        `;
        await dbPool.query(autoSettingsInsertQuery, [user_ID, temperature, humidity, light_demand, watering]);

        res.status(201).json({ message: 'Plant registered and auto settings initialized successfully' });
    } catch (error) {
        console.error('Error registering plant and initializing auto settings:', error);
        res.status(500).json({ message: 'Error registering plant and auto settings', error });
    }
});

// 사용자 식물 정보 수정 및 자동 설정 업데이트
router.patch('/update-plant/:userPlantId', ensureLoggedIn, async (req, res) => {
    const { userPlantId } = req.params;
    const { plantdata_ID : { plantdata_ID, photo_ID, temperature, humidity, light_demand, watering } } = req.body;

    console.log(req.body)
    
    if (!plantdata_ID) {
        return res.status(400).json({ message: 'plantdata_ID is required' });
    }

    try {
        // 식물 정보 업데이트
        let updateQuery = 'UPDATE User_Plants SET plantdata_ID = ?, photo_ID = ? WHERE user_plant_ID = ?';
        await dbPool.query(updateQuery, [plantdata_ID, photo_ID || null, userPlantId]);

        // 자동 설정 업데이트
        const autoSettingsUpdateQuery = `
            UPDATE DeviceAutoSettings
            SET temp_range = ?, humidity_range = ?, light_intensity = ?, watering_interval = ?
            WHERE user_ID = ?;
        `;
        await dbPool.query(autoSettingsUpdateQuery, [temperature, humidity, light_demand, watering, req.session.user.user_ID]);

        res.status(200).json({ message: 'User plant and auto settings updated successfully' });
    } catch (error) {
        console.error('Error updating user plant and auto settings:', error);
        res.status(500).json({ message: 'Error updating user plant and auto settings', error });
    }
});

// 디바이스 자동 설정 상태 조회
router.get('/device-auto-settings', ensureLoggedIn, async (req, res) => {
    const user_ID = req.session.user.user_ID;

    if (!user_ID) {
        return res.status(401).json({ message: 'Unauthorized: User not logged in' });
    }

    try {
        const query = `SELECT * FROM DeviceAutoSettings WHERE user_ID = ?`;
        const [settings] = await dbPool.query(query, [user_ID]);

        if (settings.length > 0) {
            res.status(200).json(settings);
        } else {
            res.status(404).json({ message: 'Auto settings not found for the user' });
        }
    } catch (error) {
        console.error('Error retrieving device auto settings:', error);
        res.status(500).json({ message: 'Error retrieving device auto settings', error: error.message });
    }
});

// 자동 모드 상세 설정 업데이트
router.patch('/auto-mode-settings', ensureLoggedIn, async (req, res) => {
    const user_ID = req.session.user.user_ID;
    const { temp_range, humidity_range, light_intensity, watering_interval, led_on_time, led_off_time } = req.body;

    console.log(req.body)

    if (!temp_range || !humidity_range || !light_intensity || !watering_interval) {
        return res.status(400).json({ message: 'All fields including LED on/off times are required' });
    }

    try {
        const query = `
            UPDATE DeviceAutoSettings
            SET temp_range = ?, humidity_range = ?, light_intensity = ?, watering_interval = ?, led_on_time = ?, led_off_time = ?
            WHERE user_ID = ?;
        `;
        await dbPool.query(query, [temp_range, humidity_range, light_intensity, watering_interval, led_on_time || null, led_off_time || null, user_ID]);
        res.status(200).json({ message: 'Auto mode settings updated successfully' });
    } catch (error) {
        console.error('Error updating auto mode settings:', error);
        res.status(500).json({ message: 'Error updating auto mode settings', error });
    }
});

//메인 페이지
router.get('/main-page-data', ensureLoggedIn, async (req, res) => {
    const user_ID = req.session.user.user_ID;

    try {
        const sensorLogsQuery = `
            SELECT
                sensor_type,
                value,
                unit,
                log_timestamp
            FROM (
                SELECT
                    sensor_type,
                    value,
                    unit,
                    log_timestamp,
                    ROW_NUMBER() OVER (PARTITION BY sensor_type ORDER BY log_timestamp DESC) as rn
                FROM
                    SensorLogs
                WHERE
                    user_ID = ?
            ) AS recent_logs
            WHERE rn = 1;
        `;
        const deviceInfoQuery = `
            SELECT device_ID, name FROM Devices
            WHERE user_ID = ?;
        `;
        const plantPhotosQuery = `
            SELECT up.user_plant_ID, up.photo_ID, pd.name, pd.photo AS default_photo, dp.photo AS device_photo
            FROM User_Plants up
            JOIN Plantdata pd ON up.plantdata_ID = pd.plantdata_ID
            LEFT JOIN Device_photos dp ON up.photo_ID = dp.photo_ID
            WHERE up.user_ID = ?;
        `;
        const actuatorLogsQuery = `
        SELECT 
            actuator_type,
            action,
            log_timestamp
        FROM (
            SELECT 
                actuator_type,
                action,
                log_timestamp,
                ROW_NUMBER() OVER (PARTITION BY actuator_type ORDER BY log_timestamp DESC) AS rn
            FROM 
                ActuatorLogs
            WHERE 
                user_ID = ?
        ) AS latest_logs
        WHERE rn = 1;
        `;
        const systemAutoModeQuery = `
        SELECT mode
        FROM SystemAutoMode
        WHERE user_ID = ?;
        `;
        const notificationsQuery = `
            SELECT COUNT(*) AS unreadCount
            FROM Alerts
            WHERE user_ID = ? AND read_status = 0;
        `;

        const [sensorLogs] = await dbPool.query(sensorLogsQuery, [user_ID]);
        const [deviceInfo] = await dbPool.query(deviceInfoQuery, [user_ID]);
        const [plantPhotos] = await dbPool.query(plantPhotosQuery, [user_ID]);
        const [actuatorLogs] = await dbPool.query(actuatorLogsQuery, [user_ID]);
        const [systemAutoMode] = await dbPool.query(systemAutoModeQuery, [user_ID]);
        const [unreadNotifications] = await dbPool.query(notificationsQuery, [user_ID]);

        // 타임스탬프 형식화
        sensorLogs.forEach(log => log.log_timestamp = moment(log.log_timestamp).format('YYYY-MM-DD HH:mm:ss'));
        actuatorLogs.forEach(log => log.log_timestamp = moment(log.log_timestamp).format('YYYY-MM-DD HH:mm:ss'));

        res.json({
            sensorLogs: sensorLogs,
            devices: deviceInfo,
            plants: plantPhotos,
            actuators: actuatorLogs,
            systemAutoMode: systemAutoMode[0] ? systemAutoMode[0].mode : 'off', // 모드가 직접적으로 'on' 또는 'off'인 경우
            unreadNotifications: unreadNotifications[0].unreadCount
        });
    } catch (error) {
        console.error('메인 페이지 데이터 조회 중 오류:', error);
        res.status(500).json({ message: '데이터 조회 중 오류 발생', error: error.message });
    }
});

// 디바이스 상세 정보를 조회하는 API
router.get('/devices/:device_ID', ensureLoggedIn, async (req, res) => {
    try {
        const { device_ID } = req.params;
        const query = 'SELECT * FROM Devices WHERE device_ID = ?';
        const [device] = await dbPool.query(query, [device_ID]);
        
        if (device.length === 0) {
            return res.status(404).send('Device not found');
        }

        res.json(device[0]);
    } catch (error) {
        console.error('디바이스 상세 조회 중 오류 발생:', error);
        res.status(500).send('Server Error');
    }
});

//사용자 아이디를 불러오는 엔드포인트
router.get('/id-info', ensureLoggedIn, async (req, res) => {
    const user_ID = req.session.user.user_ID
    
    try{
        if (!user_ID) {
            res.status(401).json({ message: 'User not logged in' });
        } else {
            res.status(200).json({ Id: user_ID })
        }
    } catch (error) {
        console.error('Error retrieving user_ID:', error);
        res.status(500).json({ message: 'Error retrieving user_ID', error });
    }
})

// 사용자 문의 등록
router.post('/inquiries', ensureLoggedIn, async (req, res) => {
    const user_ID = req.session.user.user_ID;
    const { subject, details } = req.body;

    if (!subject || !details) {
        return res.status(400).json({ message: 'Subject and details are required.' });
    }

    try {
        const query = `
            INSERT INTO Inquiries (user_ID, subject, details, timestamp)
            VALUES (?, ?, ?, NOW());
        `;
        await dbPool.query(query, [user_ID, subject, details]);
        res.status(201).json({ message: 'Inquiry submitted successfully.' });
    } catch (error) {
        console.error('Error submitting inquiry:', error);
        res.status(500).json({ message: 'Error submitting inquiry', error });
    }
});

// 사용자의 문의 및 답변 목록 조회
router.get('/user-inquiries', ensureLoggedIn, async (req, res) => {
    const user_ID = req.session.user.user_ID;

    try {
        const query = `
            SELECT 
                i.inquiry_ID, i.subject, i.details, i.timestamp,
                r.reply_ID, r.details AS reply_details, r.timestamp AS reply_timestamp, r.admin_ID
            FROM Inquiries i
            LEFT JOIN Inquiry_replies r ON i.inquiry_ID = r.inquiry_ID
            WHERE i.user_ID = ?
            ORDER BY i.timestamp DESC;
        `;
        const [inquiries] = await dbPool.query(query, [user_ID]);
        res.status(200).json(inquiries);
    } catch (error) {
        console.error('Error retrieving user inquiries and replies:', error);
        res.status(500).json({ message: 'Error retrieving inquiries and replies', error });
    }
});

// 만족도 조사
router.post('/satisfaction-survey', ensureLoggedIn, async (req, res) => {
    // 세션에서 user_id를 가져옴
    const user_ID = req.session.user && req.session.user.user_ID;
    const { ai_score, service_score, app_score, feedback } = req.body;

    try {
        const query = `
            INSERT INTO SatisfactionSurveys (user_id, ai_score, service_score, app_score, feedback)
            VALUES (?, ?, ?, ?, ?);
        `;
        const values = [user_ID, ai_score, service_score, app_score, feedback];
        await dbPool.query(query, values);
        res.status(201).json({ message: 'Survey submitted successfully' });
    } catch (error) {
        console.error('Error submitting survey:', error);
        res.status(500).json({ message: 'Error submitting survey', error: error.message });
    }
});

//알림 조회
router.get('/notifications', ensureLoggedIn, async (req, res) => {
    // 세션에서 user_ID 추출
    const user_ID = req.session.user && req.session.user.user_ID;

    try {
        const query = `
            SELECT * FROM Alerts
            WHERE user_ID = ? AND read_status = 0
            ORDER BY date DESC;
        `;
        const notifications = await dbPool.query(query, [user_ID]);
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error retrieving notifications:', error);
        res.status(500).json({ message: 'Error retrieving notifications', error });
    }
});

// 알림 읽음 상태 업데이트
router.patch('/notifications/read/:alertId', ensureLoggedIn, async (req, res) => {
    const user_ID = req.session.user && req.session.user.user_ID;
    const { alertId } = req.params;

    try {
        const updateQuery = `
            UPDATE Alerts
            SET read_status = TRUE
            WHERE alert_id = ? AND user_ID = ?;
        `;
        const [result] = await dbPool.query(updateQuery, [alertId, user_ID]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Notification not found or does not belong to user' });
        }
        res.status(200).json({ message: 'Notification marked as read successfully' });
    } catch (error) {
        console.error('Error updating notification read status:', error);
        res.status(500).json({ message: 'Error updating notification read status', error });
    }
});

//알림 삭제
router.delete('/notifications', ensureLoggedIn, async (req, res) => {
    const user_ID = req.session.user && req.session.user.user_ID;

    try {
        // 모든 알림을 삭제
        const deleteQuery = `
            DELETE FROM Alerts
            WHERE user_ID = ?;
        `;
        const result = await dbPool.query(deleteQuery, [user_ID]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No notifications found for the user' });
        }
        res.status(200).json({ message: 'All notifications deleted successfully' });
    } catch (error) {
        console.error('Error deleting all notifications:', error);
        res.status(500).json({ message: 'Error deleting notifications', error });
    }
});

module.exports = router;