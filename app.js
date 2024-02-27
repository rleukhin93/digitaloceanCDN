const express = require('express');
const multer = require('multer');
const { s3 } = require('./config');
const mime = require('mime-types');
const app = express();
const upload = multer();

app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    const contentType = mime.lookup(file.originalname) || 'application/octet-stream';
    const params = {
        Bucket: process.env.SPACES_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: contentType,
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error uploading file');
        }
        res.send({ url: data.Location });
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
