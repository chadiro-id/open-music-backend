const db = require('../../db/postgres');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserAlbumLikesService {
  async addLikeToAlbum({ userId, albumId }) {
    const query = {
      text: 'INSERT INTO user_album_likes (user_id, album_id) VALUES ($1, $2) RETURNING id',
      values: [userId, albumId],
    };

    const result = await db.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Like gagal ditambahkan');
    }
  }

  async getLikesCountFromAlbum(albumId) {
    const query = {
      text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };

    const result = await db.query(query);
    return result.rows[0].count;
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
  }
}

module.exports = UserAlbumLikesService;