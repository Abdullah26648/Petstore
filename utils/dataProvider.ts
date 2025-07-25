import * as fs from 'fs';
import * as path from 'path';

export class DataProvider {
  static getUser(type: string) {
    const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/testData.json'), 'utf8'));
    return data.users[type];
  }
}