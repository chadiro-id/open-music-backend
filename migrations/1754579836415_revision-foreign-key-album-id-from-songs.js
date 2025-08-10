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

  pgm.sql("INSERT INTO albums (id, name, year) VALUES ('song_without_album', 'song_without_album', 0)");

  pgm.sql("UPDATE songs SET album_id = 'song_without_album' WHERE album_id IS NULL");

  pgm.addConstraint('songs', 'songs_album_id_fkey', {
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
  pgm.dropConstraint('songs', 'songs_album_id_fkey', {
    ifExists: true,
    cascade: true,
  });

  pgm.sql("UPDATE songs SET album_id = NULL WHERE album_id = 'song_without_album'");

  pgm.sql("DELETE FROM albums WHERE id = 'song_without_album'");

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
