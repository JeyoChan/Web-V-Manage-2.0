const fs = require('fs');
const { promisify } = require('util');

const { WVFileUrl } = require('../utils/WVTools');
const { EnvVariable } = require('../config');

const read = promisify(fs.readFile);

class GetService {
  async getTutorial (fileName) {
    const fileInfo = new WVFileUrl('tutorials', fileName, EnvVariable.typeOfFile.tutorial);
    const fileUrl = fileInfo.url;
    const data = await read(fileUrl);
    return data.toString();
  }

  async getInitialCode (fileName) {
    const fileInfo = new WVFileUrl('initialCode', fileName, EnvVariable.typeOfFile.code);
    const fileUrl =  fileInfo.url;
    const data = await read(fileUrl);
    return data.toString();
  }

  async getRightCode (fileName) {
    const fileInfo = new WVFileUrl('rightCode', fileName, EnvVariable.typeOfFile.code);
    const fileUrl =  fileInfo.url;
    const data = await read(fileUrl);
    return data.toString();
  }
}

module.exports = {
  GetService
}