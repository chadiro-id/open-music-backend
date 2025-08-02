const InvariantError = require('../exceptions/InvariantError');
const {
  AlbumPayloadSchema,
  SongPayloadSchema,
  SongQuerySchema,
} = require('./schema');

const Validator = {
  validateAlbumPayload: (payload) => {
    const result = AlbumPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },

  validateSongPayload: (payload) => {
    const result = SongPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },

  validateSongQuery: (query) => {
    const result = SongQuerySchema.validate(query);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  }
};

module.exports = Validator;