const db = require('../../db/postgres');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongsService {
  async addSongToPlaylist(userId, { playlistId, songId }) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const playlistSongId = `ps-${nanoid(16)}`;

      const insertSongResult = await client.query(
        'INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING id',
        [playlistSongId, playlistId, songId]
      );

      const songActivityId = `psa-${nanoid(16)}`;
      const time = new Date();

      await client.query(
        'INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5, $6)',
        [songActivityId, playlistId, songId, userId, 'add', time]
      );

      await client.query('COMMIT');
      return insertSongResult.rows[0].id;
    } catch (error) {
      console.error(error);
      await client.query('ROLLBACK');
      throw new InvariantError('Lagu gagal ditambahkan ke daftar putar');
    } finally {
      client.release();
    }
  }

  async getSongsFromPlaylist(playlistId) {
    const query = {
      text: `SELECT s.id, s.title, s.performer
      FROM playlist_songs ps
      RIGHT JOIN songs s ON s.id = ps.song_id
      WHERE ps.playlist_id = $1
      GROUP BY s.id`,
      values: [playlistId],
    };

    const result = await db.query(query);
    return result.rows;
  }

  async deleteSongFromPlaylist(userId, { playlistId, songId }) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      await client.query(
        'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
        [playlistId, songId]
      );

      const songActivityId = `psa-${nanoid(16)}`;
      const time = new Date();

      await client.query(
        'INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5, $6)',
        [songActivityId, playlistId, songId, userId, 'delete', time]
      );
      await client.query('COMMIT');
    } catch (error) {
      console.error(error);
      await client.query('ROLLBACK');
      throw new InvariantError('Lagu gagal dihapus dari daftar putar');
    } finally {
      client.release();
    }
  }

  async getSongActivitiesFromPlaylist(playlistId) {
    const query = {
      text: `SELECT u.username, s.title, psa.action, psa.time
      FROM playlist_song_activities psa
      LEFT JOIN users u ON u.id = psa.user_id
      LEFT JOIN songs s ON s.id = psa.song_id
      WHERE psa.playlist_id = $1
      ORDER BY time`,
      values: [playlistId],
    };

    const result = await db.query(query);
    return result.rows;
  }
}

module.exports = PlaylistSongsService;