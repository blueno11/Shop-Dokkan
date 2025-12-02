const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const router = express.Router();

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9-_]/gi, '_');
    cb(null, `${Date.now()}_${base}${ext}`);
  }
});

function fileFilter(req, file, cb) {
  if (!/^image\/(png|jpe?g|gif|webp)$/.test(file.mimetype)) {
    return cb(new Error('Chỉ cho phép upload ảnh'));
  }
  cb(null, true);
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/image', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Không có file' });
  const publicUrl = `/uploads/${req.file.filename}`;
  res.status(201).json({ url: publicUrl });
});

module.exports = router;


