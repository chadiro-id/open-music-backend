const albumsValidator = require('./albums');
const authenticationsValidator = require('./authentications');
const collaborationsValidator = require('./collaborations');
const playlistsValidator = require('./playlists');
const songsValidator = require('./songs');
const usersValidator = require('./users');

module.exports = {
  albumsValidator,
  authenticationsValidator,
  collaborationsValidator,
  playlistsValidator,
  songsValidator,
  usersValidator,
};