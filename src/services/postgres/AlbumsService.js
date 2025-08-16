const db = require('../../db/postgres');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor(albumCoversService) {
    this._albumCoversService = albumCoversService;
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await db.query(query);
    if (!result.rows[0]?.id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const queryText = `
    SELECT
      a.id,
      a.name,
      a.year,
      COALESCE(
        JSON_AGG(
          JSONB_BUILD_OBJECT(
            'id', s.id,
            'title', s.title,
            'performer', s.performer
          )
        )
        FILTER (WHERE s.album_id IS NOT NULL), '[]'::json
      ) AS songs
    FROM albums a
    LEFT JOIN songs s ON a.id = s.album_id
    WHERE a.id = $1
    GROUP BY a.id;
    `;

    const result = await db.query(queryText, [id]);
    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows[0];
  }

  async getAlbumWithSongs(id) {
    const albumQuery = {
      text: 'SELECT id, name, year FROM albums WHERE id = $1',
      values: [id],
    };

    const albumResult = await db.query(albumQuery);
    if (!albumResult.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const coverUrl = await this._albumCoversService.getCoverUrl(id);
    console.log(`cover: ${coverUrl}`);

    const songsQuery = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [id],
    };

    const songsResult = await db.query(songsQuery);

    return {
      ...albumResult.rows[0],
      coverUrl,
      songs: songsResult.rows
    };
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await db.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    await this._albumCoversService.deleteCoverImage(id);

    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await db.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyAlbumById(id) {
    const query = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await db.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;