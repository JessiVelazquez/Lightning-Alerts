const assetsHashTable = {};

/**
 * Populates assetsHashTable using the quadKey parameter as a key.
 * @param {Array} assets - The assets to push into the hash table.
 * @returns {void}
 */
const populateAssetsHashTable = (assets) => {
  assets.forEach((asset) => {
    assetsHashTable[asset.quadKey] = assetsHashTable[asset.quadKey] || [];
    assetsHashTable[asset.quadKey].push(asset);
  });
};

module.exports = {
  assetsHashTable,
  populateAssetsHashTable,
};
