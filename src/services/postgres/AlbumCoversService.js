const db = require('../../db/postgres');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumCoversService {
  async addAlbumCover({ albumId, cover }) {
    const query = {
      text: 'INSERT INTO album_covers (album_id, cover) VALUES ($1, $2) RETURNING id',
      values: [albumId, cover],
    };

    const result = await db.query(query);
    if (!result.rows[0]?.id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }
}

module.exports = AlbumCoversService;