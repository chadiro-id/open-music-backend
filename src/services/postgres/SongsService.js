const db = require('../../db');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapSongDataToModel } = require('../../utils');

class SongsService {
  async addSong({
    title,
    year,
    genre,
    performer,
    duration,
    albumId
  }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId]
    };

    const result = await db.query(query);
    if (!result.rows[0]?.id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs({ title, performer }) {
    let queryText = 'SELECT id, title, performer FROM songs';
    const values = [];

    if (title && performer) {
      queryText += ' WHERE title ILIKE CONCAT(\'%\', $1::text, \'%\') AND performer ILIKE CONCAT(\'%\', $2::text, \'%\')';
      values.push(title, performer);
    } else if (title) {
      queryText += ' WHERE title ILIKE CONCAT(\'%\', $1::text, \'%\')';
      values.push(title);
    } else if (performer) {
      queryText += ' WHERE performer ILIKE CONCAT(\'%\', $1::text, \'%\')';
      values.push(performer);
    }

    const result = await db.query(queryText, values);
    return result.rows.map(mapSongDataToModel);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await db.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows.map(mapSongDataToModel)[0];
  }

  async editSongById(id, {
    title,
    year,
    genre,
    performer,
    duration,
    albumId
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await db.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await db.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;