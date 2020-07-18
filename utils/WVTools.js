const fs = require('fs');

class WVFileUrl {
  constructor (kind, FileName, type) {
    this.url = `./files/${kind}/${FileName}.${type}`;
  }
}

function sleep (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(true),ms);
  });
}

// function pathBuild () {
//   if (!fs.existsSync('/logs')) {
//     fs.mkdirSync('/logs');
//   }
//   if (!fs.existsSync('/logs/info')) {
//     fs.mkdirSync('/logs/info');
//   }
//   if (!fs.existsSync('/logs/error')) {
//     fs.mkdirSync('/logs/error');
//   }
//   if (!fs.existsSync('/logs/run')) {
//     fs.mkdirSync('/log/run');
//   }
// }

const waitQueue = [];
const finishQueue = [];

module.exports = {
  WVFileUrl,
  sleep,
  // pathBuild,
  waitQueue,
  finishQueue
};