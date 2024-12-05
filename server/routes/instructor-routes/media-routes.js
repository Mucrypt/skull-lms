const express = require('express');
const multer = require('multer');

const { uploadMediaToCloudinary, deleteMediaFromCloudinary } = require('../../helpers/cloudinary');

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { path } = req.file;
        const result = await uploadMediaToCloudinary(path);
        res.status(200).json({
            success: true, 
            message: 'File uploaded to cloudinary', 
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false, 
            message: 'Error uploading file to cloudinary'
        });
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false, 
                message: 'Please provide a public id'
            });
        }
        await deleteMediaFromCloudinary(id);
        res.status(200).json({
            success: true, 
            message: 'File deleted from cloudinary'
        })
    } catch (error) {
        res.status(500).json({
            success: false, 
            message: 'Error deleting file from cloudinary'
        });
    }
})

router.post('/bulk-upload', upload.array('files', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files uploaded",
            });
        }

        const uploadPromises = req.files.map((fileItem) => uploadMediaToCloudinary(fileItem.path));
        const results = await Promise.all(uploadPromises);

        res.status(200).json({
            success: true,
            message: "Files uploaded to cloudinary",
            data: results,
        });
    } catch (error) {
        console.error("Bulk Upload Error:", error);
        res.status(500).json({
            success: false,
            message: "Error uploading files to cloudinary",
            error: error.message,
        });
    }
});


module.exports = router