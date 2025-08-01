const InvariantError = require('../exceptions/InvariantError');
const { AlbumPayloadSchema } = require('./schema');

const Validator = {
  validateAlbumPayload: (payload) => {
    const result = AlbumPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  }
};

module.exports = Validator;