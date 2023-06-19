const fs = require('fs');

/**
 * Parses a JSON string into a JavaScript object.
 * @param {string} json - The JSON string to be parsed.
 * @returns {object|string} - The parsed JavaScript object if successful, else an error is thrown to be caught in index.js.
 */
const parseJson = (json) => {
  try {
    return JSON.parse(json);
  } catch (error) {
    throw new Error(`${error.message}`);
  }
};

/**
 * Asset data is expected to be a single array of JSON objects, so the first line is extracted and parsed. Multiple arrays of JSON objects are not supported and a warning will be output.
 * @param {string} jsonString - The JSON string to be formatted.
 * @returns {object} - The parsed JavaScript object representing the formatted JSON.
 */
const format = (jsonString) => {
  const jsonStrings = jsonString.split('\n');
  if (jsonStrings.length > 1) {
    console.warn('Warning: Only the first line of the file will be processed. Please provide a file with a single array of JSON objects.');
  }
  let parsedJson;
  try {
    parsedJson = parseJson(jsonStrings[0]);
  } catch (err) {
    throw new Error(`Error parsing JSON: ${err.message}`);
  }
  return parsedJson;
};

/**
 * Takes a path to a file containing a single array of JSON objects, and parses it.
 * If the file does not exist or cannot be read, the function will throw an error.
 * Please note: Files containing multiple arrays of JSON objects are not supported.
 * @param {string} filePath - The filepath.
 * @returns {Object|Array} - The object containing the parsed JSON.
 * @throws {Error} - If there is an error reading the file or parsing the JSON, an error will be thrown.
 */
const formatAssetsData = (filePath) => {
  let assetsRawData;
  try {
    assetsRawData = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    throw new Error(`Error reading file from path: ${filePath}`);
  }
  const assetsDataFormatted = format(assetsRawData);
  return assetsDataFormatted;
};

module.exports = {
  formatAssetsData,
};
