const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const ClientError = require('../../exceptions/ClientError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();

    this._cacheService = cacheService;
  }

  async addLikeToAlbum({ albumId, userId }) {
    const id = `albumlikes-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO album_likes VALUES ($1, $2, $3) RETURNING id',
      values: [id, albumId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Suka gagal ditambahkan');
    }

    await this._cacheService.deleteAlbumLikesCount(albumId);
  }

  async getLikesCountFromAlbum(albumId) {
    const cachedLikesCount = await this._cacheService.getAlbumLikesCount(albumId);

    if (cachedLikesCount) {
      const value = parseInt(cachedLikesCount);
      return [value, 'cache'];
    }

    const query = {
      text: 'SELECT COUNT(id) FROM album_likes WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);
    const value = parseInt(result.rows[0].count);

    await this._cacheService.setAlbumLikesCount(albumId, value);
    return [value, 'this._pool'] ;
  }

  async deleteLikeFromAlbum({ albumId, userId }) {
    const query = {
      text: 'DELETE FROM album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Suka gagal dihapus. ID tidak ditemukan');
    }

    await this._cacheService.deleteAlbumLikesCount(albumId);
  }

  async verifyLikeFromAlbumByUserId(albumId, userId) {
    const query = {
      text: 'SELECT id FROM album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount) {
      throw new ClientError('Anda sudah memberikan suka pada album ini');
    }
  }
}

module.exports = AlbumLikesService;