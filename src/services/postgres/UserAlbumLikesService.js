const db = require('../../infras/postgres');
const ClientError = require('../../exceptions/ClientError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserAlbumLikesService {
  constructor(cacheService) {
    this._cacheService = cacheService;
  }

  async addLikeToAlbum({ userId, albumId }) {
    const query = {
      text: 'INSERT INTO user_album_likes (user_id, album_id) VALUES ($1, $2) RETURNING id',
      values: [userId, albumId],
    };

    const result = await db.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Like gagal ditambahkan');
    }

    await this._cacheService.delete(`album_likes:${albumId}`);
  }

  async getLikesCountFromAlbum(albumId) {
    const cacheKey = `album_likes:${albumId}`;

    const cachedLikesCount = await this._cacheService.get(cacheKey);

    if (cachedLikesCount) {
      const count = parseInt(cachedLikesCount);
      return [count, 'cache'];
    }

    const query = {
      text: 'SELECT COUNT(id) FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };

    const result = await db.query(query);
    const count = parseInt(result.rows[0].count);

    await this._cacheService.set(cacheKey, count.toString());
    return [count, 'db'] ;
  }

  async deleteLikeFromAlbum({ userId, albumId }) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await db.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Like gagal dihapus. Id tidak ditemukan');
    }

    await this._cacheService.delete(`album_likes:${albumId}`);
  }

  async verifyLikeFromAlbumByUserId(userId, albumId) {
    const query = {
      text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await db.query(query);
    if (result.rowCount) {
      throw new ClientError('Anda sudah memberikan suka pada album ini');
    }
  }
}

module.exports = UserAlbumLikesService;