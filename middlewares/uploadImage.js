const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../config/aws');

const uploadProof = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const filename = `preuveDepot/${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
      cb(null, filename);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("paymentProof");

module.exports = uploadProof;
