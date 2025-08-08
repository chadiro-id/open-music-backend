const autoBind = require('auto-bind');

class AuthenticationsHandler {
  constructor(
    authenticationsService,
    usersService,
    tokenManager,
    validator
  ) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    autoBind(this);
  }
}

module.exports = AuthenticationsHandler;