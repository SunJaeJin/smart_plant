const { spawn } = require('child_process');
const mysql = require('mysql2/promise');

function runTrain(version, batchSize, numEpochs, numPatience, description) {
    return new Promise(async (resolve, reject) => {
        const pythonScriptPath = '/home/t24107/v1.0src/ai/train.py';
        let modelPerformance;

        const dbConfig = {
            host: 'localhost',
            user: 'dbid241',
            password: 'dbpass241',
            database: 'db24107',
            port: 3306
        };

        const connection = await mysql.createConnection(dbConfig);

        const pythonProcess = spawn('python', [pythonScriptPath, version, batchSize, numEpochs, numPatience]);

        pythonProcess.stdout.on('data', (data) => {
            console.log(data.toString());
            const lines = data.toString().split('\n');
            lines.forEach((line) => {
                // const epochMatch = line.match(/Epoch (\d+)\/(\d+)/);
                // if (epochMatch) {
                //     console.log(`학습 진행중, 현재 에포크: ${epochMatch[1]}/${epochMatch[2]}`);
                // }

                const performanceMatch = line.match(/F1 score : (\d+\.\d+)/);
                if (performanceMatch) {
                    modelPerformance = parseFloat(performanceMatch[1]);
                    // console.log(`모델 성능 (F1 Score): ${modelPerformance}`);
                }
            });
        });

        pythonProcess.stderr.on('data', (data) => {
            // console.error(`stderr from Python script: ${data.toString()}`);
        });

        pythonProcess.on('close', async (code) => {
            console.log('학습 종료됨.');
            if (modelPerformance) {
                try {
                    const training_date = new Date();
                    const query = `
                        INSERT INTO AI_models (version, training_date, accuracy, description)
                        VALUES (?, ?, ?, ?)
                    `;
                    await connection.execute(query, [version, training_date, modelPerformance, description]);
                    console.log('모델 데이터 DB 저장 완료');
                    resolve(modelPerformance); // 학습이 완료되면 resolve 호출
                } catch (error) {
                    console.error('모델 데이터 DB 저장 실패:', error);
                    reject(error); // 에러가 발생하면 reject 호출
                } finally {
                    await connection.end();
                }
            }
            else {
                reject(new Error('모델 성능을 가져올 수 없습니다. 학습이 완료되지 않았습니다.'))
            }
        });
    });
}

module.exports = runTrain;
