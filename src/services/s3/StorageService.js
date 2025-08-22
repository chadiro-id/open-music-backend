const {
  uploadFile,
  deleteFile,
  generateSignedUrl
} = require('../../infras/s3');

class StorageService {
  async uploadAlbumCover(albumId, fileStream) {
    const {
      _data: fileBuffer,
      hapi: {
        filename,
        headers: {
          ['content-type']: mimeType
        }
      }
    } = fileStream;

    const fileExt = require('path').extname(filename);
    const key = `images/albums/${albumId}/cover${fileExt}`;

    await uploadFile(key, fileBuffer, mimeType);

    return key;
  }

  async deleteAlbumCover(key) {
    await deleteFile(key);
  }

  async getAlbumCoverUrl(key) {
    await generateSignedUrl(key);
  }
}

module.exports = StorageService;