const { downloadImageService, saveImageOnDatabaseService, getImageService, getAllImagesService, runPhotoService } = require('../services/profileService');

const downloadImageController = async (req, res) => {
    const { imageUrl, imageName } = req.body;
    const userId = req.user.id;

    try{
        await downloadImageService(imageUrl, imageName)
        await saveImageOnDatabaseService(userId, imageName);
        return res.status(200).json(`Download ${imageName}.png successfully`);
    }catch(err){
        return res.status(500).json({ error: err.message });
    }

};

const getImageController = async (req, res) => {
    const userId = req.user.id;

    try{
        image = await getImageService(userId)
        return res.status(200).json(image);
    } catch(err){
        return res.status(500).json({ error: err.message });
    }
}

const getAllImagesController = async (req, res) => {
    try {
        const allImages = await getAllImagesService();
        return res.status(200).json(allImages);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const runPhotoController = async (req, res) => {
    const { imageName } = req.query; 

    if (!imageName) {
        return res.status(400).json({ error: 'No image name provided' });
    }

    try {
        const result = await runPhotoService(imageName);

        if (typeof result === 'string' && result.endsWith('.php')) {
            return res.status(500).json({ error: 'Executed a file' });
        } else {
            return res.sendFile(result); 
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = { downloadImageController, getImageController, getAllImagesController, runPhotoController };