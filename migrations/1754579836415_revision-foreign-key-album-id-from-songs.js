/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.dropIndex('songs', 'album_id', {
    name: 'idx_song_by_album_id',
  });

  pgm.dropConstraint('songs', 'fk_album_id', {
    ifExists: true,
    cascade: true,
  });

  // membuat user baru.
  pgm.sql("INSERT INTO albums (id, name, year) VALUES ('no_albums', 'no_albums', 0)");

  // mengubah nilai owner pada note yang owner-nya bernilai NULL
  pgm.sql("UPDATE songs SET album_id = 'no_albums' WHERE album_id IS NULL");

  pgm.addConstraint('songs', 'fk_album_id', {
    foreignKeys: {
      columns: 'album_id',
      references: 'albums(id)',
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
  pgm.dropConstraint('songs', 'fk_album_id', {
    ifExists: true,
    cascade: true,
  });

  // mengubah nilai owner old_notes pada note menjadi NULL
  pgm.sql("UPDATE songs SET album_id = NULL WHERE album_id = 'no_albums'");

  // menghapus user baru.
  pgm.sql("DELETE FROM albums WHERE id = 'no_albums'");

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
