/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('album_covers', {
    id: {
      type: 'SERIAL',
      primaryKey: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    cover: {
      type: 'TEXT',
      notNull: true,
    }
  });

  pgm.addConstraint('album_covers', 'album_covers_album_id_fkey', {
    foreignKeys: {
      columns: 'album_id',
      references: 'albums(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });

  pgm.addConstraint('album_covers', 'album_covers_album_id_cover_key', {
    unique: ['album_id', 'cover'],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint('album_covers', 'album_covers_album_id_cover_key', {
    ifExists: true,
    cascade: true,
  });

  pgm.dropConstraint('album_covers', 'album_covers_album_id_fkey', {
    ifExists: true,
    cascade: true,
  });

  pgm.dropTable('album_covers');
};
