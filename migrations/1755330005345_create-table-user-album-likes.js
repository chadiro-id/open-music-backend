/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'SERIAL',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    }
  });

  pgm.addConstraint('user_album_likes', 'user_album_likes_user_id_fkey', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
  });

  pgm.addConstraint('user_album_likes', 'user_album_likes_album_id_fkey', {
    foreignKeys: {
      columns: 'album_id',
      references: 'albums(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
  });

  pgm.addConstraint('user_album_likes', 'user_album_likes_user_id_album_id_key', { unique: ['user_id', 'album_id'] });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint('user_album_likes', 'user_album_likes_user_id_album_id_key');
  pgm.dropConstraint('user_album_likes', 'user_album_likes_album_id_fkey');
  pgm.dropConstraint('user_album_likes', 'user_album_likes_user_id_fkey');
  pgm.dropTable('user_album_likes');
};
