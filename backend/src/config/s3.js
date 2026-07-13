const AWS = require("aws-sdk");
const multer = require("multer");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const upload = multer({ storage: multer.memoryStorage() });

const uploadToS3 = (file) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `profiles/${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };
  return s3.upload(params).promise();
};

module.exports = { upload, uploadToS3 };
