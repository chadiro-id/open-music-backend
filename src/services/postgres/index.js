const AlbumsService = require('./AlbumsService');
const AuthenticationsService = require('./AuthenticationsService');
const CollaborationsService = require('./CollaborationsService');
const PlaylistSongsService = require('./PlaylistSongsService');
const PlaylistsService = require('./PlaylistsService');
const SongsService = require('./SongsService');
const UsersService = require('./UsersService');

const albumsService = new AlbumsService();
const authenticationsService = new AuthenticationsService();
const collaborationsService = new CollaborationsService();
const playlistSongsService = new PlaylistSongsService();
const playlistsService = new PlaylistsService(collaborationsService);
const songsService = new SongsService();
const usersService = new UsersService();

module.exports = {
  albumsService,
  authenticationsService,
  collaborationsService,
  playlistSongsService,
  playlistsService,
  songsService,
  usersService
};