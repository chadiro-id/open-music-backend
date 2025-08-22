const config = require('../../config');

const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand
} = require('@aws-sdk/client-s3');

const client = new S3Client({
  region: config.aws.s3.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

const uploadFile = (key, fileBuffer, mimeType) => {
  const command = new PutObjectCommand({
    Bucket: config.aws.s3.bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  return client.send(command);
};

const deleteFile = (key) => {
  const command = new DeleteObjectCommand({
    Bucket: config.aws.s3.bucketName,
    Key: key,
  });

  return client.send(command);
};

const generateSignedUrl = (key, expiresIn = 2100) => {
  const command = new GetObjectCommand({
    Bucket: config.aws.s3.bucketName,
    Key: key,
  });

  return getSignedUrl(client, command, { expiresIn });
};

module.exports = {
  uploadFile,
  deleteFile,
  generateSignedUrl
};

