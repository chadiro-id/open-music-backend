/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    }
  }, { ifNotExists: true });

  pgm.addConstraint('collaborations', 'collaborations_playlist_id_user_id_key', {
    unique: [
      'playlist_id',
      'user_id'
    ],
  });

  pgm.addConstraint('collaborations', 'collaborations_playlist_id_fkey', {
    foreignKeys: {
      columns: 'playlist_id',
      references: 'playlists(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });

  pgm.addConstraint('collaborations', 'collaborations_user_id_fkey', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint('collaborations', 'collaborations_user_id_fkey', {
    ifExists: true,
    cascade: true,
  });

  pgm.dropConstraint('collaborations', 'collaborations_playlist_id_fkey', {
    ifExists: true,
    cascade: true,
  });

  pgm.dropConstraint('collaborations', 'collaborations_playlist_id_user_id_key', {
    ifExists: true,
    cascade: true,
  });

  pgm.dropTable('collaborations', { ifExists: true });
};
