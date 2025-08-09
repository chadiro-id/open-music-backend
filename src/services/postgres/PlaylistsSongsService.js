const db = require('../../db/postgres');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistsSongsService {
  async addPlaylistSong({ playlistId, songId }) {
    const id = `ps-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists_songs VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await db.query(query);
    if (!result.rows[0]?.id) {
      throw new InvariantError('Playlist song gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async deletePlaylistSong({ playlistId, songId }) {
    const query = {
      text: 'DELETE FROM playlists_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await db.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Playlist song gagal dihapus');
    }
  }

  async verifyPlaylistSong({ playlistId, songId }) {
    const query = {
      text: 'SELECT * FROM playlists_songs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };

    const result = await db.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Playlist song gagal diverifikasi');
    }
  }
}

module.exports = PlaylistsSongsService;