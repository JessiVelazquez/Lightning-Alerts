const quadkeytools = require('quadkeytools');
const { convertXYToQuadkey } = require('../src/convertToQuadkey');

jest.mock('quadkeytools');

describe('X/Y to Quadkey conversion', () => {
  it('converts X/Y coordinates and zoom level (Z) to quadkey', () => {
    const x = 47.6419;
    const y = -122.3493;
    const z = 12;
    const expectedQuadKey = '0211330130103';

    quadkeytools.locationToQuadkey.mockReturnValue(expectedQuadKey);

    const quadkey = convertXYToQuadkey(x, y, z);

    expect(quadkey).toBe(expectedQuadKey);
    expect(quadkeytools.locationToQuadkey).toHaveBeenCalledWith({ lat: x, lng: y }, z);
  });
});
