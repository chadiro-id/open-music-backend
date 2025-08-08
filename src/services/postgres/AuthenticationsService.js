const db = require('../../db/postgres');
const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationsService {
  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await this._pool.query(query);
  }
}

module.exports = AuthenticationsService;