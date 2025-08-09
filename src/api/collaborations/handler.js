const autoBind = require('auto-bind');

class CollborationsHandler {
  constructor(services, validator) {
    [
      this._collaborationsService,
      this._playlistsService
    ] = services;

    this._validator = validator;

    autoBind(this);
  }
}

module.exports = CollborationsHandler;