const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(
    albumsService,
    albumCoversService,
    userAlbumLikesService,
    albumsValidator,
    uploadsValidator
  ) {
    this._albumsService = albumsService;
    this._albumCoversService = albumCoversService;
    this._userAlbumLikesService = userAlbumLikesService;
    this._albumsValidator = albumsValidator;
    this._uploadsValidator = uploadsValidator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._albumsValidator.validateAlbumPayload(request.payload);

    const { name, year } = request.payload;

    const albumId = await this._albumsService.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      }
    });

    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;

    const album = await this._albumsService.getAlbumWithSongs(id);

    return {
      status: 'success',
      data: {
        album,
      }
    };
  }

  async putAlbumByIdHandler(request) {
    this._albumsValidator.validateAlbumPayload(request.payload);

    const { id } = request.params;
    const { name, year } = request.payload;

    await this._albumsService.editAlbumById(id, { name, year });

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;

    await this._albumsService.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postCoverToAlbumHandler(request, h) {
    const { cover } = request.payload;

    this._uploadsValidator.validateImageHeaders(cover.hapi.headers);

    const { id } = request.params;

    await this._albumCoversService.addCoverToAlbum(id, cover);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah'
    });

    response.code(201);
    return response;
  }

  async postLikeToAlbumHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._userAlbumLikesService.addLikeToAlbum({ userId: credentialId, albumId });

    const response = h.response({
      status: 'success',
      message: 'Like berhasil ditambahkan ke album'
    });

    response.code(201);
    return response;
  }

  async getLikesCountFromAlbumHandler(request) {
    const { id } = request.params;

    const likesCount = await this._userAlbumLikesService.getLikesCountFromAlbum(id);

    return {
      status: 'success',
      data: {
        likes: likesCount,
      },
    };
  }
}

module.exports = AlbumsHandler;