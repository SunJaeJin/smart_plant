const fs = require('fs');

async function getCurrentAIVersion() {
  path = "/home/t24107/aidata/model_version.txt"
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}

module.exports = getCurrentAIVersion;
