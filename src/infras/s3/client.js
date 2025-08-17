const config = require('../../config');
const { S3Client } = require('@aws-sdk/client-s3');

const client = new S3Client({
  region: config.aws.s3.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

module.exports = client;