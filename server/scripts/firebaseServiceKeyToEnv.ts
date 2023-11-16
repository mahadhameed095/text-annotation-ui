import * as fs from 'fs';
import util from 'util';
import { spawn } from 'child_process';

/* accepts the path as cmdline input */

const jsonFilePath = process.argv[2];

const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

const envString = Object.entries(jsonData).map(([key, value]) => `FIREBASE_AUTH_${key.toUpperCase()}="${value}"`).join('\n');

console.log(envString);

/* will copy it as well */
spawn('clip').stdin.end(util.inspect(envString));