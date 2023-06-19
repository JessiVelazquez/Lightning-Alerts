# Lightning Alerts

Author: Jessi Velazquez, June 2023

[Link to Github Repository](https://github.com/JessiVelazquez/LightningAlerts)
## About the Program

This program reads lightning event data as a stream (using Node.js's [Readline Interface Module](https://nodejs.org/api/readline.html#readlinecreateinterfaceoptions)) from standard input (one lightning strike per line as a JSON object), and matches that data against a set of assets (also in JSON format). When there are lightning strikes in the vicinity of an asset, the program sends an alert in the following format:

```log
lightning alert for <assetOwner>:<assetName>
```

## Time Complexity

The time complexity for determing if a strike occurred in a particular area is **O(n+1), where *n=assets***.

- This is because we loop through the assets (*n*) to create hash table where each asset is stored at an index keyed off of its **quadKey** property.

- Since lightning data is read in as a stream, we can determine a match between a strike and an asset with an O(1) lookup by asking the hash table to return the asset value at the quadkey of the lightning strike. If there is a match, we send the alert. 

- By leveraging another hash table of unique keys made by concatenating the quadkey and assetOwner that is both built and referenced within this same operation, we can check for previous alerts for an assetOwner in a quadkey without adding time complexity, and avoid sending the same alert twice.

## Possible Improvements

If this code was found to be too slow, or it needed to scale to many more users or more frequent strikes, here are a few things to explore that may improve it:

- The Node.js function we are using to format the assets data ([fs.readFileSync()](https://www.geeksforgeeks.org/node-js-fs-readfilesync-method/)), is a synchronous function that must complete before the program can continue. The reason for this is because we need the complete asset dataset to be in the assets hash table before we start checking lightning strikes for matches, lest we miss a match. However, this is a potential bottleneck that could slow the program if there are a lot of assets. There is an asynchronous version of this function ([fs.readFile()](https://www.geeksforgeeks.org/node-js-fs-readfile-method/)) that would allow the program to continue while assets data is being read. However, there would still be the problem of not wanting to check streamed lightning data against an incomplete asset data set. Nonetheless, I think it is worth exploring solutions here, perhaps involving some batching operations.

- If the program is found to be buggy, then refactoring to [Typescript](https://www.typescriptlang.org/) may improve performance.



## Data Input

**Lightning data** is expected to be recieved as one file containing a list of JSON objects, where one object represents one lightning strike. Example:

```
{"flashType":1,"strikeTime":1446760902510,"latitude":8.7020156,"longitude":-12.2736188,"peakAmps":3034,"reserved":"000","icHeight":11829,"receivedTime":1446760915181,"numberOfSensors":6,"multiplicity":1}
{"flashType":1,"strikeTime":1446760902380,"latitude":10.5799716,"longitude":-14.0589797,"peakAmps":3117,"reserved":"000","icHeight":18831,"receivedTime":1446760915182,"numberOfSensors":8,"multiplicity":1}
```

**Assets data** is expected to be recieved as a file containing a single array of JSON objects, each representing an asset. Example:

```
[{"assetName":"Mayer Park","quadKey":"023112133002","assetOwner":"02115"},{"assetName":"Sunshine Wall","quadKey":"023112133003","assetOwner":"325"},{"assetName":"Cruickshank Forge","quadKey":"023112133000","assetOwner":"313"}]
```


## Running the Program

 Steps to run the program are as follows:

1. Make sure you have Node.js and npm (Node Package Manager) installed on your machine. You can find instructions on how to do this [HERE](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

2. If you haven't already, clone the Github repository by clicking 'Code' at this link ([https://github.com/JessiVelazquez/LightningAlerts](https://github.com/JessiVelazquez/LightningAlerts)) and copying the proper Github repository url (SSH or HTTPS).

3. Using the command line, navigate to the location on your machine that you want to save the program, and run the following command: `git clone <repository_url>`.

4. Naviogate to the root of the project directory (`cd <project_directory>`), and install dependencies by running the following command: `npm install`.

5. *Optional*: Place your data files named **lightning.json** and **assets.json** at the root of the project (same level as **index.js**) (if you choose not to do this, make note of the local file paths to the data files).

6. If your data files are at the root of the project directory, run the command `npm start`.

7. If the files are elsewhere, you can specify them in the start command by running `npm start <assets_file_path> <lightning_file_path>`

## Automated Tests

This program leverages the [Jest](https://jestjs.io/docs/getting-started) testing framework to offer a set of automated tests. These are set up in the `/tests` folder as one test file per file in the `/src` folder. 

Tests can be run by running this command at the root of the project: `npm run test`.

Test cases are as follows:

### FormatAssetData

- should parse a single array of valid JSON strings
- if given an invalid file path, should throw an error
- if given invalid JSON, should throw an error

### PopulateAssetsHashTable

- correctly populates the assetsHashTable using the quadKey property for the key

### ProcessStrikes

- can process a strike and send the alert if there is a matched asset
- does not process system heartbeat data
- will not send a second alert for same assetOwner in the same quadkey

### convertToQuadkey

- proper X/Y coordinates to Quadkey conversion

## Linting, Code Standards, and Notation

This codebase uses [eslint](https://eslint.org/) to lint against the ECMAScript 2021 (ES2021) syntax and rules.

Code comments follow the [JSDoc](https://jsdoc.app/about-getting-started.html) notation format.




