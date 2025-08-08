const db = require('../../db/postgres');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class UsersService {
  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername(username);

    const id = nanoid(16);
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users VALUES (CONCAT(\'user-\', $1::text, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    const result = await db.query(query);
    if (!result.rowCount) {
      throw new InvariantError('User gagal ditambahkan');
    }

    return result.rows[0]?.id;
  }

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