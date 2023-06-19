const { populateAssetsHashTable, assetsHashTable } = require('../src/populateAssetsHashTable');

describe('Correct population of assetHashTable', () => {
  beforeEach(() => {
    Object.keys(assetsHashTable).forEach((key) => delete assetsHashTable[key]);
  });

  it('correctly populates the assetsHashTable using the quadKey property for the key', () => {
    const mockAssets = [
      { assetName: 'Test Asset 1', quadKey: '023112133002', assetOwner: '02115' },
      { assetName: 'Test Asset 2', quadKey: '023112133003', assetOwner: '325' },
      { assetName: 'Test Asset 3', quadKey: '023112133002', assetOwner: '456' },
    ];

    populateAssetsHashTable(mockAssets);

    expect(Object.keys(assetsHashTable)).toHaveLength(2);
    expect(assetsHashTable['023112133002']).toHaveLength(2);
    expect(assetsHashTable['023112133003']).toHaveLength(1);

    expect(assetsHashTable['023112133002'][0]).toEqual(mockAssets[0]);
    expect(assetsHashTable['023112133002'][1]).toEqual(mockAssets[2]);
    expect(assetsHashTable['023112133003'][0]).toEqual(mockAssets[1]);

    expect(assetsHashTable['023112133003'][0].assetOwner).toEqual(mockAssets[1].assetOwner);
  });
});
