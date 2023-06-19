const quadkeytools = require('quadkeytools');

/**
 * Converts X,Y coordinates to quadkeys.
 *
 * @param {number} x - X coordinate (latitiude)
 * @param {number} y - Y coordinate (longitude)
 * @param {number} z - Zoom level (Z-value)
 * @returns {string} - Quadkey of the coordinates at the specified level of detail.
 */
const convertXYToQuadkey = (x, y, z) => {
  const location = { lat: x, lng: y };
  const detail = z;
  return quadkeytools.locationToQuadkey(location, detail);
};

module.exports = {
  convertXYToQuadkey,
};
