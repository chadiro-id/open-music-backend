/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createIndex('album_likes', ['album_id', 'user_id'], {
    name: 'album_likes_album_id_user_id_idx',
    ifNotExists: true,
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropIndex('album_likes', ['album_id', 'user_id'], {
    name: 'album_likes_album_id_user_id_idx',
    ifExists: true,
  });
};
