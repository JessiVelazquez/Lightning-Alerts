const { processStrikes } = require('../src/processStrikes');
const { convertXYToQuadkey } = require('../src/convertToQuadkey');

jest.mock('../src/convertToQuadkey');

describe('processStrikes', () => {
  beforeEach(() => {
    convertXYToQuadkey.mockClear();
    console.log = jest.fn(); // mock the actual console.log send of the alert
  });

  it('can process a strike and alert if there is a matched asset', () => {
    const mockStrike = {
      flashType: 1,
      strikeTime: 1446761134729,
      latitude: 47.6419,
      longitude: -122.3493,
      peakAmps: -19353,
      reserved: '000',
      icHeight: 0,
      receivedTime: 1446761145765,
      numberOfSensors: 5,
      multiplicity: 1,
    };
    const mockQuadkey = '023112133002';
    const mockAssets = {
      [mockQuadkey]: [
        { assetName: 'Test Asset 1', quadKey: mockQuadkey, assetOwner: '02115' },
      ],
    };
    convertXYToQuadkey.mockReturnValue(mockQuadkey);

    processStrikes(mockStrike, mockAssets);

    expect(convertXYToQuadkey).toHaveBeenCalledWith(mockStrike.latitude, mockStrike.longitude, 12);
    expect(console.log).toHaveBeenCalledWith('lightning alert for 02115:Test Asset 1');
  });

  it('does not process system heartbeat data', () => {
    const systemHeartbeatStrike = {
      flashType: 9, // 9 = system heartbeat, not a strike
      strikeTime: 1446761134729,
      latitude: 47.6419,
      longitude: -122.3493,
      peakAmps: -19353,
      reserved: '000',
      icHeight: 0,
      receivedTime: 1446761145765,
      numberOfSensors: 5,
      multiplicity: 1,
    };
    const mockQuadkey = '023112133002';
    const mockAssets = {
      [mockQuadkey]: [
        { assetName: 'Test Asset 1', quadKey: mockQuadkey, assetOwner: '02115' },
      ],
    };

    processStrikes(systemHeartbeatStrike, mockAssets);

    expect(convertXYToQuadkey).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
  });

  it('will not send a second alert for same assetOwner and quadkey', () => {
    const mockStrikes = [
      {
        flashType: 1,
        strikeTime: 1446761134729,
        latitude: 47.6419,
        longitude: -122.3493,
        peakAmps: -19353,
        reserved: '000',
        icHeight: 0,
        receivedTime: 1446761145765,
        numberOfSensors: 5,
        multiplicity: 1,
      },
      {
        flashType: 1,
        strikeTime: 1446761134767,
        latitude: 35.2188571,
        longitude: -96.0724577,
        peakAmps: -19555,
        reserved: '003',
        icHeight: 0,
        receivedTime: 1446761145776,
        numberOfSensors: 7,
        multiplicity: 1,
      },
    ];

    const mockQuadkey = '023112131032';
    const mockAssets = {
      [mockQuadkey]: [
        { assetName: 'Test Asset 1', quadKey: mockQuadkey, assetOwner: '02115' },
      ],
    };
    convertXYToQuadkey.mockReturnValue(mockQuadkey);

    mockStrikes.forEach((strike) => {
      processStrikes(strike, mockAssets);
    });

    expect(convertXYToQuadkey).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenCalledTimes(1);
  });
});
