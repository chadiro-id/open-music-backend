const { Pool } = require('pg');

class AlbumCoversService {
  constructor(
    storageService,
    cacheService,
  ) {
    this._pool = new Pool();

    this._storageService = storageService;
    this._cacheService = cacheService;
  }

  async addCoverToAlbum(albumId, cover) {
    const coverKey = await this.uploadCoverImage(albumId, cover);

    const query = {
      text: 'INSERT INTO album_covers (album_id, cover) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      values: [albumId, coverKey],
    };

    await this._pool.query(query);
    await this._cacheService.deleteAlbum(albumId);
  }

  async getCoverUrl(albumId) {
    const query = {
      text: 'SELECT cover FROM album_covers WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);
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

    const result = await this._pool.query(query);
    if (result.rows[0]?.cover) {
      await this._storageService.deleteFile(result.rows[0].cover);
    }
  }
}

module.exports = AlbumCoversService;