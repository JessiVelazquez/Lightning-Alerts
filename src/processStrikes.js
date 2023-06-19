const { convertXYToQuadkey } = require('./convertToQuadkey');

const ownerQuadkeyHashTable = {};
const systemHeartbeat = 9;
const quadkeyZoomLevel = 12;

/**
 * Sends alerts for unique combinations of assetOwner and quadkey.
 *
 * @param {Object} asset - The asset data.
 * @param {string} quadkey - The associated that matched the asset and strike.
 * @returns {void} - No need to return anything here.
 */
const sendUniqueAlert = (asset, quadkey) => {
  const { assetOwner, assetName } = asset;
  const unqiqueAlertKey = `${assetOwner}:${quadkey}`;
  if (!(unqiqueAlertKey in ownerQuadkeyHashTable)) {
    console.log(`lightning alert for ${assetOwner}:${assetName}`);
    ownerQuadkeyHashTable[unqiqueAlertKey] = true;
  }
};

/**
 * Matches strikes with assets based on location and sends unique alerts for each matched asset.
 * If a strike is a system heartbeat, it will be skipped.
 * Instantiates an array for a location match so that there are multiple assets with different owners in a single quadkey, we can send seperate alerts.
 *
 * @param {Object} strike - The strike data.
 * @param {Object} assets - Hash table containing assets, where key = quadKey.
 * @returns {void}
 */
const processStrikes = (strike, assets) => {
  if (strike.flashType === systemHeartbeat) {
    return;
  }
  const strikeQuadkey = convertXYToQuadkey(strike.latitude, strike.longitude, quadkeyZoomLevel);
  const matchedAssets = assets[strikeQuadkey] || [];
  matchedAssets.forEach((asset) => {
    sendUniqueAlert(asset, strikeQuadkey);
  });
};

module.exports = {
  processStrikes,
};
