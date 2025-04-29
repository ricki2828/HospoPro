// scripts/generate-historical-weather.cjs

const fs = require('fs');
const path = require('path');

// CommonJS requires don't need ts-node if the target is JS, but we need TS capability
// We still need a way to execute the TS service file. 
// Let's try ts-node require hook within CommonJS

let generateHistoricalWeatherData;
try {
    // Register ts-node for require
    require('ts-node').register({ /* options */ }); 
    generateHistoricalWeatherData = require('../src/services/historicalWeatherDataService.ts').generateHistoricalWeatherData;
} catch (error) {
    console.error("Error requiring ts-node or the service file:", error);
    console.error("Ensure ts-node is installed (npm install --save-dev ts-node) and the path is correct.");
    process.exit(1);
}

const YEARS_TO_GENERATE = 2;
const OUTPUT_DIR = path.join(__dirname, '../src/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'historicalWeatherData.json');

console.log(`Generating ${YEARS_TO_GENERATE} years of mock historical weather data...`);

const historicalData = generateHistoricalWeatherData(YEARS_TO_GENERATE);

console.log(`Generated ${historicalData.length} days of data.`);

// Ensure output directory exists
try {
  if (!fs.existsSync(OUTPUT_DIR)){
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created directory: ${OUTPUT_DIR}`);
  }
} catch (err) {
  console.error(`Error creating directory ${OUTPUT_DIR}:`, err);
  process.exit(1);
}

// Write data to JSON file
try {
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(historicalData, null, 2));
  console.log(`Successfully wrote historical weather data to ${OUTPUT_FILE}`);
} catch (err) {
  console.error(`Error writing to file ${OUTPUT_FILE}:`, err);
  process.exit(1);
} 