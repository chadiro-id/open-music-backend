/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('album_likes', {
    id: {
      type: 'VARCHAR(50)',
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
  }, { ifNotExists: true });

  pgm.addConstraint('album_likes', 'album_likes_album_id_fkey', {
    foreignKeys: {
      columns: 'album_id',
      references: 'albums(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
  });

  pgm.addConstraint('album_likes', 'album_likes_user_id_fkey', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
  });

  pgm.addConstraint('album_likes', 'album_likes_album_id_user_id_key', { unique: ['album_id', 'user_id'] });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint('album_likes', 'album_likes_album_id_user_id_key', { ifExists: true });
  pgm.dropConstraint('album_likes', 'album_likes_user_id_fkey', { ifExists: true });
  pgm.dropConstraint('album_likes', 'album_likes_album_id_fkey', { ifExists: true });
  pgm.dropTable('album_likes', { ifExists: true });
};
