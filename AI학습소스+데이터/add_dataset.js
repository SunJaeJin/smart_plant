const fs = require('fs');
const path = require('path');

async function addDataset(imagePaths, isForTest, plantName) {
    const testDirectory = '/home/t24107/aidata/dataset_test';
    const trainDirectory = '/home/t24107/aidata/dataset_train';
    const saveDirectory = isForTest ? testDirectory : trainDirectory;
    const plantDirectory = path.join(saveDirectory, plantName);

    try {
        // 데이터셋 경로에 식물 이름을 가진 폴더가 없으면 새로 생성
        if (!fs.existsSync(plantDirectory)) {
            await fs.promises.mkdir(plantDirectory, { recursive: true });
        }

        // 이미지들 비동기적으로 이동
        await Promise.all(imagePaths.map(async sourcePath => {
            const targetPath = path.join(plantDirectory, path.basename(sourcePath));
            await fs.promises.rename(sourcePath, targetPath);
            console.log(`Image added to "${targetPath}"`);
        }));

        return true; // 성공
    } catch (error) {
        console.error('Error saving images:', error);
        return false; // 실패
    }
}

module.exports = addDataset;
