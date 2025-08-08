const InvariantError = require('../../exceptions/InvariantError');
const {
  SongPayloadSchema,
  SongQuerySchema,
} = require('./schema');

const SongsValidator = {
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

module.exports = SongsValidator;