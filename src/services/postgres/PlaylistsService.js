const db = require('../../infras/postgres');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor(collaborationsService) {
    this._collaborationsService = collaborationsService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await db.query(query);
    if (!result.rows[0]?.id) {
      throw new InvariantError('Daftar putar gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(credentialId) {
    const query = {
      text: `SELECT p.id, p.name, u.username
      FROM playlists p
      LEFT JOIN collaborations c ON c.playlist_id = p.id
      LEFT JOIN users u ON u.id = p.owner
      WHERE p.owner = $1 OR c.user_id = $1
      GROUP BY p.id, u.username
      `,
      values: [credentialId],
    };

    const result = await db.query(query);

    return result.rows;
  }

  async getPlaylistById(id) {
    const query = {
      text: `SELECT p.id, p.name, u.username
      FROM playlists p
      LEFT JOIN users u ON u.id = p.owner
      WHERE p.id = $1`,
      values: [id],
    };

    const result = await db.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Daftar putar tidak ditemukan');
    }

    return result.rows[0];
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await db.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Daftar putar gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await db.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Daftar putar tidak ditemukan');
    }

    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak memiliki hak untuk mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationsService.verifyCollaborator({ playlistId, userId });
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;