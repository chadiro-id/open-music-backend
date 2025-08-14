const Joi = require('joi');

const imageTypes = [
  'image/apng',
  'image/avif',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/webp',
];

const ImageHeadersSchema = Joi.object({
  'content-type': Joi.string().valid(imageTypes).required(),
}).unknown();

module.exports = { ImageHeadersSchema };