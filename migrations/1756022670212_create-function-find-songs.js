/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createFunction(
    'find_songs',
    [
      { name: 'p_title', type: 'VARCHAR', default: 'NULL' },
      { name: 'p_performer', type: 'VARCHAR', default: 'NULL' }
    ],
    {
      returns: `TABLE (
        id VARCHAR,
        title VARCHAR,
        performer VARCHAR
      )`,
      language: 'plpgsql'
    },
    `BEGIN
      RETURN QUERY
      SELECT s.id, s.title, s.performer
      FROM songs s
      WHERE 
        (p_title IS NULL OR s.title ILIKE '%' || p_title || '%')
        AND (p_performer IS NULL OR s.performer ILIKE '%' || p_performer || '%');
    END;`,
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropFunction(
    'find_songs',
    [
      { name: 'p_title', type: 'VARCHAR' },
      { name: 'p_performer', type: 'VARCHAR' }
    ],
  );
};
