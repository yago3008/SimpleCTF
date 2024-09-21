const fs = require('fs');
const axios = require('axios');
const path = require('path');
const User = require('../models/User');
const { sequelize } = require('../config/database');
const imagePath = 'C:/Users/Yago/Documents/Node/projeto pessoal/arqs/images'

const getCurrentTime = () => {
    const now = new Date();
  
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}-${minutes}-${seconds}`;
  };

  const downloadImageService = async (imageUrl, imageName) => {
    const newImageName = `${imageName}.png`;
    const concatPath = path.join(imagePath, newImageName);
    const writer = fs.createWriteStream(concatPath);

    try {
        
        if (imageUrl.startsWith('file://')) {
            const filePath = imageUrl.replace('file://', '');
            const response = fs.createReadStream(filePath);

            response.pipe(writer);
        } if (imageUrl.startsWith('gopher://')) {
            const filePath = imageUrl.replace('gopher://', '');
            const response = fs.createReadStream(filePath);

            response.pipe(writer);
        } else {
            // Continua usando axios para URLs externas
            const response = await axios({
                url: imageUrl,
                method: 'GET',
                responseType: 'stream',
            });

            response.data.pipe(writer);
        }

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        throw new Error('Download image failed: ' + error.message);
    }
};

const saveImageOnDatabaseService = async (userId, imageName) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const updateQuery = `UPDATE users SET imageName = '${imageName}' WHERE id = ${userId};`;
    await sequelize.query(updateQuery);

};

const getImageService = async (userId) => {
    const user = await User.findOne({
        where: { id: userId },
        attributes: ['imageName']
      });

    if (!user) {
        throw new Error('User not found');
    }

    const currentImagePath = path.join(imagePath, user.imageName + '.png');

    try {
        const fileContent = fs.readFileSync(currentImagePath, 'utf-8');
        return fileContent;

    } catch (err) {
        throw new Error('Failed to read the image file ' + err);
    }
};


const getAllImagesService = () => {
    try {
        const files = fs.readdirSync(imagePath);
        const fileNames = files.filter(file => {
            const filePath = path.join(imagePath, file);
            return fs.statSync(filePath).isFile();
        });

        return fileNames;
    } catch (err) {
        throw new Error(`Failed to read the path: ${err.message}`);
    }
};

const isExecutablefile = (filePath) => {
    const allowedExtensions = ['.js', '.php', '.html', '.py', '.bat', '.sh', '.exe'];
    return allowedExtensions.some(ext => filePath.includes(ext));
};


const runPhotoService = async (imageName) => {
    const newImagePath = path.join(imagePath, imageName)

    fs.stat(newImagePath, (err, stats) => {
        if (err || !stats.isFile()){
            return reject(new Error('Image not found'));
        }

        if (isExecutablefile(newImagePath)) {
            exec(`cmd /c ${newImagePath}`, (error, stdout, stderr) => {
                if (error) {
                    return reject(new Error('File is not executable'));
                }
                resolve (stdout);
            });
        } else {
            resolve(newImagePath);
        }
        
    });
};

module.exports = { downloadImageService,
                saveImageOnDatabaseService,
                getImageService,
                getAllImagesService,
                runPhotoService
            }