const fs = require('fs');
const readline = require('readline');
const { formatAssetsData } = require('./src/formatAssetsData');
const { processStrikes } = require('./src/processStrikes');
const { populateAssetsHashTable, assetsHashTable } = require('./src/populateAssetsHashTable');

/**
 * Get file paths from command line arguments, or use defaults
 */
const assetsFilePath = process.argv[2] || './assets.json';
const lightningFilePath = process.argv[3] || './lightning.json';

/**
 * Format raw assets data
 * Exit process here in try/catch if there is an error: this allows formatAssetsData() to throw an error so it can be tested without stopping Node process, and we can catch it and handle it here.
 */
let assetsDataFormatted;
try {
  assetsDataFormatted = formatAssetsData(assetsFilePath);
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

/**
 * Populate assets hash table
 */
populateAssetsHashTable(assetsDataFormatted);

/**
 * Sets up data stream of lightning strikes
 * Docs - https://nodejs.org/api/readline.html#readlinecreateinterfaceoptions
 *
 * @param {string} lightningFilePath - The filepath to the data.
 * @returns {readline.Interface} - The data stream interface for reading the file.
 */
const dataStream = readline.createInterface({
  input: fs.createReadStream(lightningFilePath).on('error', () => {
    console.error(`Error reading file from path: ${lightningFilePath}`);
    process.exit(1);
  }),
  console: false,
});

/**
 * Event handler that processes individual strike objects when 'line' is emitted from dataStream.
 *
 * @param {string} line - The event being emitted from dataStream.
 * @returns {void}
 */
dataStream.on('line', (line) => {
  const strike = JSON.parse(line);
  processStrikes(strike, assetsHashTable);
});
