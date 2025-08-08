const db = require('../../db/postgres');
const InvariantError = require('../../exceptions/InvariantError');

class UsersService {

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await db.query(query);
    if (result.rowCount) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan');
    }
  }

}

module.exports = UsersService;