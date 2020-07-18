const fs = require('fs');
const { promisify } = require('util');
const { exec } = require('child_process');
const moment = require('moment');

const { sleep } = require('../utils/WVTools');
const { EnvVariable, waitTime } = require('../config');
const { WVLogger } = require('../utils/WVLog');
const { containerManager } = require('../service/containerService');

const write = promisify(fs.writeFile);
const del = promisify(fs.unlink);
const pExec = promisify(exec);

class SendService {
  async runCode (code) {
    const ret = {
      suc: true,
      result: {}
    };
    const runInfo = {};
    let out = false;
    let fileName = null;
    let fileUrl = null;
    while (true) {
      let comeAgain = false;
      fileName = Date.now().toString(); //以当前时间作临时文件的名字
      fileUrl = EnvVariable.tempCodeUrl(fileName);
      await write(fileUrl, code)
        .catch(async (err) => {
          comeAgain = true;
          await sleep(5); // 睡眠5ms
        });
      if (!comeAgain) {
        break;
      }
    }
    let result = null;
    while (global.curProcess >= 1) {
      await sleep(500);
    }
    global.curProcess += 1;
    const startTime = Date.now();
    runInfo.startTime = moment(startTime).utcOffset('+08:00').format();
    result = await pExec(`cd ${EnvVariable.runEnv} && ./waf --run ${fileName}`, { timeout: 60000})
      .catch (async (err) => {
        const endTime = Date.now();
        global.curProcess -= 1;
        runInfo.endTime = moment(endTime).utcOffset('+08:00').format();
        runInfo.time = `${endTime - startTime}ms`;
        runInfo.fileName = fileName;
        runInfo.more = err;
        WVLogger.forwardInfo(runInfo);
        ret.result.time = runInfo.time;
        ret.result.info = err;
        await del(fileUrl);
        out = true;
      });
    if (out) {
      return ret;
    }
    const endTime = Date.now();
    global.curProcess -= 1;
    runInfo.endTime = moment(endTime).utcOffset('+08:00').format();
    runInfo.time = `${endTime - startTime}ms`;
    runInfo.fileName = fileName;
    runInfo.more = {
      stdout: result.stdout,
      stderr: result.stderr
    };
    WVLogger.forwardInfo(runInfo);
    ret.result.time = runInfo.time;
    ret.result.stderr = result.stderr;
    ret.result.stdout = result.stdout;
    await del(fileUrl);
    return ret;
  }

  async forward (code) {
    const ret = {
      suc: true,
      result: {}
    }
    const logInfo = {
      forwardInfo: {
        suc: true
      },
      runInfo: {}
    };
    const number = Symbol();

    // let freeContainer = containerManager.getAFreeContainer(number);
    // while (typeof freeContainer != 'object') {
    //   await sleep(waitTime[freeContainer]); // wait time depending on the position in the list
    //   freeContainer = containerManager.getAFreeContainer(number); // 取号
    // }

    containerManager.intoQueue(number, code);
    while (true) {
      const runState = containerManager.getRunState(number);
      if (waitTime[runState]) {
        await sleep(waitTime[runState]);
      } else { //finished
        break;
      }
    }
    const { forwardResult, moreInfo } = containerManager.getResponseInfo(number);
    logInfo.forwardInfo.containerInfo = {
      containerOrder: moreInfo.containerOrder,
      containerIP: moreInfo.containerHost
    };
    if (!forwardResult.suc) {
      ret.suc = logInfo.forwardInfo.suc = false;
      ret.result = logInfo.forwardInfo.more = forwardResult.err;
      WVLogger.forwardInfo(logInfo);
      return ret;
    }
    logInfo.forwardInfo.startTime = moment(moreInfo.startTime).utcOffset('+08:00').format();
    logInfo.forwardInfo.endTime = moment(moreInfo.endTime).utcOffset('+08:00').format();
    logInfo.forwardInfo.time = moreInfo.time;
    const response = forwardResult.response;
    // const options = {
    //   method: 'POST',
    //   uri: `http://${freeContainer.host}:${freeContainer.port}${freeContainer.api}`,
    //   form: {
    //     code
    //   }
    // };
    // const startTime = Date.now();
    // const responseJSON = await rp(options)
    //   .catch((err) => {
    //     ret.suc = false;
    //     logInfo.forwardInfo.suc = false;
    //     ret.result = err;
    //   });
    // containerManager.free(freeContainer.order);
    // if (!responseJSON || responseJSON == 'undefined') { // docker service killed
    //   ret.suc = false;
    //   logInfo.forwardInfo.suc = false;
    //   ret.result = 'service inside docker killed!';
    // }
    // const response = JSON.parse(responseJSON);
    // const endTime = Date.now();
    // logInfo.forwardInfo.time = `${endTime - startTime}ms`;
    logInfo.runInfo.suc = response.suc;
    if (response.suc) {
      logInfo.runInfo.startTime = moment(response.data.startTime).utcOffset('+08:00').format();
      logInfo.runInfo.endTime = moment(response.data.endTime).utcOffset('+08:00').format();
      logInfo.runInfo.time = `${response.data.endTime - response.data.startTime}ms`;
      logInfo.runInfo.stdout = response.data.stdout;
      logInfo.runInfo.stderr = response.data.stderr;
      ret.result.stdout = response.data.stdout;
      ret.result.stderr = response.data.stderr;
      ret.result.time = logInfo.runInfo.time;
    } else {
      ret.suc = false;
      logInfo.runInfo.more = response.err;
      ret.result = response.err;
    }
    WVLogger.forwardInfo(logInfo);
    return ret;
  }
}

module.exports = {
  SendService
}
