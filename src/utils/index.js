const mapAlbumDataToModel = ({
  id,
  name,
  year,
}) => ({
  albumId: id,
  name,
  year,
});

module.exports = {
  mapAlbumDataToModel
};