/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
    }
  }, { ifNotExists: true });


  pgm.sql("INSERT INTO users (id, username, password, fullname) VALUES ('playlist_ownerless', 'playlist_ownerless', 'playlist_ownerless', 'playlist_ownerless')");

  pgm.sql("UPDATE playlists SET owner = 'playlist_ownerless' WHERE owner IS NULL");

  pgm.addConstraint('playlists', 'playlists_owner_fkey', {
    foreignKeys: {
      columns: 'owner',
      references: 'users(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint('playlists', 'playlists_owner_fkey', {
    ifExists: true,
    cascade: true,
  });

  pgm.sql("UPDATE playlists SET owner = NULL WHERE owner = 'playlist_ownerless'");

  pgm.sql("DELETE FROM users WHERE id = 'playlist_ownerless'");

  pgm.dropTable('playlists', { ifExists: true });
};
