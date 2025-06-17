const fs = require('fs');
const path = require('path');

// 지정한 경로에 존재하는 각각의 디렉터리들에 대해서, 안에 있는 이미지 파일들의 개수를 반환
function getImageCount() {
    const directoryPath = '/home/t24107/aidata/dataset_train';

    // 디렉터리 내 파일 및 하위 디렉터리 목록을 반환
    function getFilesAndDirectories(dir) {
        return fs.readdirSync(dir, { withFileTypes: true });
    }

    // 디렉터리 내 이미지 파일의 갯수를 반환
    function countImages(dir) {
        const files = fs.readdirSync(dir);
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif';
        })

        return imageFiles.length;
    }

    // 디렉터리 내 디렉터리들의 이미지 갯수를 세고 JSON 형태로 반환
    function getImageCountRecursively(dirPath) {
        const directories = getFilesAndDirectories(dirPath);
        const labels = [];
        const data = [];

        directories.forEach(item => {
            if (item.isDirectory()) {
                const directoryPath = path.join(dirPath, item.name);
                const imageCount = countImages(directoryPath);
                labels.push(item.name);
                data.push(imageCount);
            }
        });

        return { labels, data };
    }

    return getImageCountRecursively(directoryPath);
}

module.exports = getImageCount;