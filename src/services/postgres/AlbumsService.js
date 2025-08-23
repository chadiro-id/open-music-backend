const db = require('../../infras/postgres');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor(
    albumCoversService,
    cacheService
  ) {
    this._albumCoversService = albumCoversService;
    this._cacheService = cacheService;
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
    const cachedAlbum = await this._cacheService.getAlbum(id);
    if (cachedAlbum) {
      return [cachedAlbum, 'cache'];
    }

    const query = {
      text: 'SELECT id, name, year FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await db.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const coverUrl = await this._albumCoversService.getCoverUrl(id);
    console.log(`[Albums Service] get album by id -> cover url: ${coverUrl}`);

    const album = {
      ...result.rows[0],
      coverUrl,
    };

    await this._cacheService.setAlbum(id, album);

    return [album, 'db'];
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

    await this._cacheService.deleteAlbum(id);
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

    await this._cacheService.deleteAlbum(id);
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