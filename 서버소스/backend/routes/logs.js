const express = require('express')
const router = express.Router()
const db = require('./db')
const { getIo } = require('./socket')

//센서 로그 저장 및 조건에 따른 알림 생성
router.post('/sensor-logs', async (req, res) => {
    const { user_ID, sensor_type, value, unit } = req.body;
    const log_timestamp = new Date();
    const io = getIo()

    try {
        // 센서 로그 데이터를 데이터베이스에 저장
        const logQuery = `
            INSERT INTO SensorLogs (user_ID, sensor_type, log_timestamp, value, unit)
            VALUES (?, ?, ?, ?, ?);
        `;
        const results = await db.query(logQuery, [user_ID, sensor_type, log_timestamp, value, unit]);

        // 수위센서(sensor_type = 'water')에서 수위가 20% 이하일 경우 알림 생성
        if (sensor_type === 'water' && parseFloat(value) <= 30) {
            const alertMessage = `물 잔량이 (${value}${unit})이하입니다. 물을 채워주세요.`;
            const alertQuery = `
                INSERT INTO Alerts (user_ID, type, message, date, read_status)
                VALUES (?, ?, ?, NOW(), FALSE);
            `;
            
            await db.query(alertQuery, [user_ID, 'water', alertMessage]);

            // 유저 ID로 emit
            io.emit('new-alert' + user_ID, { message: alertMessage, type: 'water' });
        }

        res.status(201).json({ message: 'Log created and alert checked', logId: results.insertId });
    } catch (error) {
        console.error('Error creating sensor log or alert:', error);
        res.status(500).json({ message: 'Error creating sensor log or alert', error });
    }
});

// 액츄에이터 로그 저장 및 알림 전송
router.post('/actuator-log', async (req, res) => {
    const io = getIo();
    const { user_ID, actuator_type, action } = req.body;

    try {
        // 액츄에이터 로그를 데이터베이스에 저장
        const logQuery = `INSERT INTO ActuatorLogs (user_ID, actuator_type, action) VALUES (?, ?, ?)`;
        await db.query(logQuery, [user_ID, actuator_type, action]);

        // 'Pump' 유형에 대해서만 알림 생성
        if (actuator_type === 'Pump') {
            const alertQuery = `INSERT INTO Alerts (user_ID, type, message, date, read_status) VALUES (?, ?, ?, NOW(), FALSE)`;
            const message = `급수 모듈이 작동하였습니다.`;
            await db.query(alertQuery, [user_ID, 'Pump', message]);

            // 유저 ID로 emit
            io.emit('new-alert' + user_ID, { message, type: 'Pump' });

        }

        res.status(201).json({ message: 'Log recorded successfully and alert sent' });
    } catch (error) {
        console.error('Error saving actuator log and sending alert:', error);
        res.status(500).json({ message: 'Error saving actuator log and sending alert', error });
    }
});


//센서 로그 데이터 불러오기
router.get('/sensor-logs', async (req, res) => {
    const { user_ID, sensor_type } = req.query;

    try {
        const query = `
            SELECT * FROM SensorLogs
            WHERE user_ID = ?
            ORDER BY log_timestamp DESC;
        `;
        const logs = await db.query(query, [user_ID, sensor_type]);
        res.status(200).json(logs);
    } catch (error) {
        console.error('Error retrieving sensor logs:', error);
        res.status(500).json({ message: 'Error retrieving sensor logs' });
    }
});

module.exports = router;