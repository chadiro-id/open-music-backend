const db = require('../../infras/postgres');
const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationsService {
  constructor(cacheService) {
    this._cacheService = cacheService;
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await db.query(query);
    await this._cacheService.setRefreshToken(token);
  }

  async verifyRefreshToken(token) {
    const cachedRefreshToken = await this._cacheService.verifyRefreshToken(token);
    if (cachedRefreshToken) {
      return;
    }

    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await db.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await db.query(query);
    await this._cacheService.deleteRefreshToken(token);
  }
}

module.exports = AuthenticationsService;