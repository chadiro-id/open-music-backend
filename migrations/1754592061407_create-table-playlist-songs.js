/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    }
  });

  pgm.addConstraint('playlist_songs', 'playlist_songs_playlist_id_song_id_key', {
    unique: [
      'playlist_id',
      'song_id'
    ],
  });

  pgm.addConstraint('playlist_songs', 'playlist_songs_playlist_id_fkey', {
    foreignKeys: {
      columns: 'playlist_id',
      references: 'playlists(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });

  pgm.addConstraint('playlist_songs', 'playlist_songs_song_id_fkey', {
    foreignKeys: {
      columns: 'song_id',
      references: 'songs(id)',
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
  pgm.dropConstraint('playlist_songs', 'playlist_songs_song_id_fkey', {
    ifExists: true,
    cascade: true,
  });

  pgm.dropConstraint('playlist_songs', 'playlist_songs_playlist_id_fkey', {
    ifExists: true,
    cascade: true,
  });

  pgm.dropConstraint('playlist_songs', 'playlist_songs_playlist_id_song_id_key', {
    ifExists: true,
    cascade: true,
  });

  pgm.dropTable('playlist_songs');
};
