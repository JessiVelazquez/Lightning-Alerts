const fs = require('fs');
const { formatAssetsData } = require('../src/formatAssetsData');

jest.mock('fs');

describe('formatAssetsData', () => {
  beforeEach(() => {
    fs.readFileSync.mockClear();
    console.warn = jest.fn();
  });

  it('should parse a single array of valid JSON strings', () => {
    const mockString = '[{"assetName":"Mayer Park","quadKey":"023112133002","assetOwner":"02115"},{"assetName":"Boyle Cape","quadKey":"023112310103","assetOwner":"94908"}]\n[{"assetName":"Sunshine Wall","quadKey":"023112133003","assetOwner":"325"}]';
    fs.readFileSync.mockReturnValue(mockString);

    // Assets is expected to be an array of JSON objects, so our parsing and formatting functions are designed to take the first line of the JSON file.
    const expectedOutput = [
      {
        assetName: 'Mayer Park',
        quadKey: '023112133002',
        assetOwner: '02115',
      },
      {
        assetName: 'Boyle Cape',
        quadKey: '023112310103',
        assetOwner: '94908',
      },
    ];

    const result = formatAssetsData('');

    expect(console.warn).toHaveBeenCalledWith('Warning: Only the first line of the file will be processed. Please provide a file with a single array of JSON objects.');
    expect(result).toEqual(expectedOutput);
  });

  it('if given an invalid file path, should throw an error', () => {
    // Mock fs.readFileSync(), so whenever is called during this test, immediately throw a new Error with the message 'File not found'."
    fs.readFileSync.mockImplementation(() => {
      throw new Error('File not found');
    });

    expect(() => formatAssetsData('invalidPath')).toThrow('Error reading file from path: invalidPath');
  });

  it('if given invalid JSON, should throw an error', () => {
    const mockString = '{"invalid: "json"}\n{"more bad";"json"}';
    fs.readFileSync.mockReturnValue(mockString);

    expect(() => formatAssetsData('')).toThrow('Error parsing JSON: Expected \':\' after property name in JSON at position 12');
  });
});
