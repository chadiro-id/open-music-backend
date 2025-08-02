/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.addConstraint('songs', 'fk_album_id', {
    foreignKeys: {
      columns: 'album_id',
      references: 'albums(id)',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
  });

  pgm.createIndex('songs', 'album_id', {
    name: 'idx_song_by_album_id',
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint('songs', 'fk_album_id', {
    ifExists: true,
    cascade: true,
  });

  pgm.dropIndex('songs', 'album_id', {
    name: 'idx_song_by_album_id',
  });
};
