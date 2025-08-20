const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(
    albumsService,
    albumCoversService,
    albumLikesService,
    albumsValidator,
    uploadsValidator
  ) {
    this._albumsService = albumsService;
    this._albumCoversService = albumCoversService;
    this._albumLikesService = albumLikesService;
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

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;

    const [album, source] = await this._albumsService.getAlbumWithSongs(id);

    const response = h.response({
      status: 'success',
      data: {
        album,
      },
    });

    if (source === 'cache') {
      response.header('X-Data-Source', 'cache');
    }

    return response;
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

    await this._albumsService.verifyAlbumById(albumId);
    await this._albumLikesService.verifyLikeFromAlbumByUserId(albumId, credentialId);

    await this._albumLikesService.addLikeToAlbum({ albumId, userId: credentialId });

    const response = h.response({
      status: 'success',
      message: 'Like berhasil ditambahkan ke album'
    });

    response.code(201);
    return response;
  }

  async deleteLikeFromAlbumHandler(request) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._albumLikesService.deleteLikeFromAlbum({ albumId, userId: credentialId });

    return {
      status: 'success',
      message: 'Like berhasil dihapus dari album',
    };
  }

  async getLikesCountFromAlbumHandler(request, h) {
    const { id } = request.params;

    const [likes, dataSource] = await this._albumLikesService.getLikesCountFromAlbum(id);

    console.log(`[Albums Handler] likes -> count: ${likes}, src: ${dataSource}`);

    const response = h.response({
      status: 'success',
      data: {
        likes,
      }
    });

    if (dataSource === 'cache') {
      response.header('X-Data-Source', 'cache');
    }

    return response;
  }
}

module.exports = AlbumsHandler;