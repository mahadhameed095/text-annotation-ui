import * as fs from 'fs';
import * as dotenv from 'dotenv';

// Load variables from the .env file
const envFilePath = process.argv[2]; // Update with your .env file path
const envConfig = dotenv.parse(fs.readFileSync(envFilePath));

// Convert environment variables to the desired JSON format
const jsonResult = Object.entries(envConfig).map(([name, value]) => ({
  name,
  value,
  slotSetting: false,
}));

// Print the resulting JSON object
console.log(JSON.stringify(jsonResult, null, 2));
