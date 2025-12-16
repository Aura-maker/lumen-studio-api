// Servizio per generare presigned URLs S3 (AWS SDK v3)
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const region = process.env.AWS_REGION;
const bucket = process.env.S3_BUCKET;

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

/**
 * Genera presigned URL per upload (PUT)
 * @param {string} key path dentro il bucket
 * @param {number} expiresSec scadenza in secondi
 */
async function generaPresignedUpload(key, expiresSec = 60) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ACL: 'private'
  });
  const url = await getSignedUrl(s3, command, { expiresIn: expiresSec });
  return url;
}

module.exports = { generaPresignedUpload };