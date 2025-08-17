const config = require('../../config');
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');

const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

class StorageService {
  constructor() {
    this._client = new S3Client({
      region: config.aws.s3.region,
      credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
      },
    });
  }

  async uploadFile(key, fileBuffer, mimeType) {
    const command = new PutObjectCommand({
      Bucket: config.aws.s3.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
    });

    await this._client.send(command);
  }

  async deleteFile(key) {
    const command = new DeleteObjectCommand({
      Bucket: config.aws.s3.bucketName,
      Key: key,
    });

    await this._client.send(command);
  }

  generateSignedUrl(key, expiresIn = 3600) {
    const command = new GetObjectCommand({ Bucket: config.aws.s3.bucketName, Key: key });
    return getSignedUrl(this._client, command, { expiresIn });
  }
}

module.exports = StorageService;