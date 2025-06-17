const express = require('express')
const bcrypt = require('bcrypt')
const moment = require('moment')
const path = require('path')
const router = express.Router()
const dbPool = require('./db')
const { getIo } = require('./socket')

// 관리자 로그인 상태 확인 미들웨어
function ensureAdminLoggedIn(req, res, next) {
    if (!req.session.admin || !req.session.admin.admin_ID) {
        return res.status(401).json({ message: 'Access denied: Admin not logged in' });
    }
    next();
}

//관리자 로그인
router.post('/login', async (req, res) => {
    const { admin_ID, password } = req.body;

    try {
        const [admins] = await dbPool.query('SELECT * FROM Admins WHERE admin_ID = ?', [admin_ID]);
        if (admins.length > 0) {
            const admin = admins[0];
            const passwordMatch = await bcrypt.compare(password, admin.password);
            
            if (passwordMatch) {
                // 세션에 관리자 정보 저장
                req.session.admin = { admin_ID: admin.admin_ID, name: admin.name };
                // 로그인 성공 응답에 'success' 키 추가
                res.json({ success: true, message: 'Logged in successfully' });
            } else {
                // 비밀번호 불일치 응답
                res.status(401).json({ success: false, message: 'Invalid password' });
            }
        } else {
            // 관리자 미발견 응답
            res.status(404).json({ success: false, message: 'Admin not found' });
        }
    } catch (error) {
        // 서버 에러 응답
        console.error(error);
        res.status(500).json({ success: false, message: 'Error logging in' });
    }
});

// 로그인 상태 확인 라우터
router.get('/check-login', (req, res) => {
    if (req.session && req.session.admin) { // 관리자 세션 체크
        res.json({ loggedIn: true, user: req.session.admin });
    } else {
        res.json({ loggedIn: false });
    }
});

//로그아웃
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

//사용자 목록 조회
router.get('/users', ensureAdminLoggedIn, async (req, res) => {
    try {
        const [users] = await dbPool.query('SELECT * FROM Users');
        // 데이터베이스에서 검색된 사용자 정보를 JSON 형식으로 클라이언트에 보냅니다.
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving users' });
    }
});

router.get('/users/:loginID', ensureAdminLoggedIn, async (req, res) => {
    try {
        const [results] = await dbPool.query('SELECT * FROM Users WHERE user_ID = ?', [req.params.loginID]);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving user details' });
    }
});

// 사용자 삭제
router.delete('/users/:loginID', ensureAdminLoggedIn, async (req, res) => {
    const loginID = req.params.loginID;
    const connection = await dbPool.getConnection();
    await connection.beginTransaction(); // 트랜잭션 시작

    try {
        // 연관된 데이터를 먼저 삭제
        await connection.query('DELETE FROM Devices WHERE user_ID = ?', [loginID]);
        await connection.query('DELETE FROM Inquiry_replies WHERE user_ID = ?', [loginID]);
        await connection.query('DELETE FROM Inquiries WHERE user_ID = ?', [loginID]);
        await connection.query('DELETE FROM Alerts WHERE user_ID = ?', [loginID]);
        await connection.query('DELETE FROM Actions WHERE user_ID = ?', [loginID]);
        await connection.query('DELETE FROM SensorLogs WHERE user_ID = ?', [loginID]);

        // 사용자 데이터 삭제
        const [results] = await connection.query('DELETE FROM Users WHERE user_ID = ?', [loginID]);
        if (results.affectedRows > 0) {
            await connection.commit(); // 트랜잭션 커밋
            res.json({ message: 'User deleted successfully' });
        } else {
            await connection.rollback(); // 롤백
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        await connection.rollback(); // 에러 시 롤백
        console.error(error);
        res.status(500).json({ message: 'Error deleting user' });
    } finally {
        connection.release(); // 커넥션 해제
    }
});

// 모든 디바이스 목록을 조회하는 API
router.get('/devices', ensureAdminLoggedIn, async (req, res) => {
    try {
        const query = 'SELECT * FROM Devices';
        const [devices] = await dbPool.query(query);
        res.json(devices);
    } catch (error) {
        console.error('디바이스 목록 조회 중 오류 발생:', error);
        res.status(500).send('Server Error');
    }
});

// 디바이스 상세 정보 조회
router.get('/devices/:device_ID', ensureAdminLoggedIn, async (req, res) => {
    const { device_ID } = req.params;

    try {
        // 디바이스 기본 정보 조회
        const deviceQuery = 'SELECT * FROM Devices WHERE device_ID = ?';
        const [device] = await dbPool.query(deviceQuery, [device_ID]);
        
        if (device.length === 0) {
            return res.status(404).send('Device not found');
        }

        const user_ID = device[0].user_ID;

        // 각 센서 유형별 최신 로그 조회
        const sensorLogsQuery = `
            SELECT sensor_type, value, unit, log_timestamp
            FROM (
                SELECT sensor_type, value, unit, log_timestamp,
                       ROW_NUMBER() OVER (PARTITION BY sensor_type ORDER BY log_timestamp DESC) as rn
                FROM SensorLogs
                WHERE user_ID = ?
            ) AS recent_logs
            WHERE rn = 1;
        `;
        const [sensorLogs] = await dbPool.query(sensorLogsQuery, [user_ID]);
        sensorLogs.forEach(log => log.log_timestamp = moment(log.log_timestamp).format('YYYY-MM-DD HH:mm:ss'));

        // 액츄에이터 로그 조회
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
        const [actuatorLogs] = await dbPool.query(actuatorLogsQuery, [user_ID]);
        actuatorLogs.forEach(log => log.log_timestamp = moment(log.log_timestamp).format('YYYY-MM-DD HH:mm:ss'));

        // 자동 모드 상세 설정 조회
        const autoSettingsQuery = 'SELECT * FROM DeviceAutoSettings WHERE user_ID = ?';
        const [autoSettings] = await dbPool.query(autoSettingsQuery, [user_ID]);

        // 자동 모드 on/off 조회
        const autoSystemModeQuery = 'SELECT mode FROM SystemAutoMode WHERE user_ID = ?';
        const [autoSystemMode] = await dbPool.query(autoSystemModeQuery, [user_ID]);

        // 식물 사진 조회
        const plantPhotosQuery = `
        SELECT up.user_plant_ID, up.photo_ID, pd.name, pd.photo AS default_photo, dp.photo AS device_photo
        FROM User_Plants up
        JOIN Plantdata pd ON up.plantdata_ID = pd.plantdata_ID
        LEFT JOIN Device_photos dp ON up.photo_ID = dp.photo_ID
        WHERE up.user_ID = ?;
        `;
        const [plantPhotos] = await dbPool.query(plantPhotosQuery, [user_ID]);

        res.json({
            device: device[0],
            sensorLogs: sensorLogs,
            actuatorLogs: actuatorLogs,
            autoSettings: autoSettings[0] || {},
            autoSystemMode: autoSystemMode[0] || { mode: 'off' },
            plants: plantPhotos
        });
    } catch (error) {
        console.error('디바이스 상세 조회 중 오류 발생:', error);
        res.status(500).send('Server Error');
    }
});

// 사용자의 문의 내역만 조회
router.get('/all-inquiries', ensureAdminLoggedIn, async (req, res) => {
    try {
        const query = `
            SELECT 
                inquiry_ID, 
                user_ID, 
                subject, 
                details, 
                timestamp, 
                status
            FROM Inquiries
            ORDER BY timestamp DESC;
        `;
        const [inquiries] = await dbPool.query(query);

        res.status(200).json(inquiries);
    } catch (error) {
        console.error('Error retrieving inquiries for admin:', error);
        res.status(500).json({ message: 'Error retrieving inquiries', error });
    }
});

// 관리자가 문의에 답변을 저장하고 문의 상태를 업데이트
router.post('/inquiries/:inquiryId/replies', ensureAdminLoggedIn, async (req, res) => {
    const { inquiryId } = req.params;
    const { details, admin_ID } = req.body;

    // 데이터베이스 연결 및 트랜잭션 시작
    const connection = await dbPool.getConnection();
    await connection.beginTransaction();

    try {
        // 사용자 ID를 조회
        const [inquiries] = await connection.query('SELECT user_ID FROM Inquiries WHERE inquiry_ID = ?', [inquiryId]);
        if (inquiries.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Inquiry not found' });
        }
        const userId = inquiries[0].user_ID;

        // 답변 저장
        const replyQuery = `
            INSERT INTO Inquiry_replies (inquiry_ID, user_ID, admin_ID, details, timestamp)
            VALUES (?, ?, ?, ?, NOW())
        `;
        await connection.query(replyQuery, [inquiryId, userId, admin_ID, details]);

        // 문의 상태 업데이트
        const statusUpdateQuery = 'UPDATE Inquiries SET status = ? WHERE inquiry_ID = ?';
        await connection.query(statusUpdateQuery, ['answered', inquiryId]);

        // 문의 답변 알림 전송
        const alertQuery = `
            INSERT INTO Alerts (user_ID, type, message, date, read_status)
            VALUES (?, ?, ?, NOW(), FALSE);
        `;
        const alertMessage = `문의에 답변이 등록되었습니다.`;
        await connection.query(alertQuery, [userId, 'inquiry', alertMessage]);

        // 트랜잭션 커밋
        await connection.commit();

        // 사용자에게 알림 전송
        const io = getIo();
        io.emit('new-alert' + userId, { message: alertMessage, type: 'inquiry_reply' });

        res.status(201).json({ message: 'Reply added and inquiry status updated successfully' });
    } catch (error) {
        // 에러 발생 시 롤백
        await connection.rollback();
        console.error('Error posting reply and updating inquiry status:', error);
        res.status(500).json({ message: 'Error posting reply and updating inquiry status', error });
    } finally {
        // 연결 해제
        connection.release();
    }
});

module.exports = router;