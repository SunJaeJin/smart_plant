const fs = require('fs');

async function updateAIVersion(version) {
    path = "/home/t24107/aidata/model_version.txt";
    return new Promise((resolve, reject) => {
        fs.writeFile(path, version, 'utf8', (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

module.exports = updateAIVersion;
