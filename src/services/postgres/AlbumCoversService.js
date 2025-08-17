const db = require('../../infras/postgres');

class AlbumCoversService {
  constructor(storageService) {
    this._storageService = storageService;
  }

  async addCoverToAlbum(albumId, cover) {
    const coverKey = await this.uploadCoverImage(albumId, cover);

    const query = {
      text: 'INSERT INTO album_covers (album_id, cover) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      values: [albumId, coverKey],
    };

    await db.query(query);
  }

  async getCoverUrl(albumId) {
    const query = {
      text: 'SELECT cover FROM album_covers WHERE album_id = $1',
      values: [albumId],
    };

    const result = await db.query(query);
    if (!result.rowCount) {
      return null;
    }

    const coverUrl = await this._storageService.generateSignedUrl(result.rows[0].cover);
    return coverUrl;
  }

  async uploadCoverImage(albumId, coverFileStream) {
    const {
      _data: fileBuffer,
      hapi: {
        filename,
        headers: {
          ['content-type']: mimeType
        }
      }
    } = coverFileStream;

    const fileExt = require('path').extname(filename);
    const key = `images/albums/${albumId}/cover${fileExt}`;

    await this._storageService.uploadFile(key, fileBuffer, mimeType);

    return key;
  }

  async deleteCoverImage(albumId) {
    const query = {
      text: 'SELECT cover FROM album_covers WHERE album_id = $1',
      values: [albumId],
    };

    const result = await db.query(query);
    if (result.rows[0]?.cover) {
      await this._storageService.deleteFile(result.rows[0].cover);
    }
  }
}

module.exports = AlbumCoversService;