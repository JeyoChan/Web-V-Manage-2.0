const md5 = require('md5-node');
const moment = require('moment');

const { WVLogger } = require('../utils/WVLog');
const { ContainerRunService } = require('./containerService');

class SendService {
  constructor(code) {
    this.code = code;
  }

  async runCode() {
    const ret = { suc: false, result: {} };
    const thisKey = md5(this.code + Date.now());
    const containerRun = new ContainerRunService(thisKey);
    if (await containerRun.noContainerExist() === true) {
      ret.result = '无可用容器';
      return ret;
    }
    await containerRun.pushTaskIntoQueue(this.code);
    const result = await containerRun.getTaskResult();
    this.writeLog4RunResult(result);
    if (result.suc == 'false') {
      ret.result = result.err;
      return ret;
    }
    ret.suc = true;
    ret.result.stdout = result.runInfo_stdout;
    ret.result.stderr = result.runInfo_stderr;
    ret.result.time = `${result.runInfo_endTime - result.runInfo_startTime}ms`;
    return ret;
  }

  writeLog4RunResult(result) {
    const logInfo = {};
    logInfo.containerInfo = result.containerInfo;
    logInfo.suc = result.suc;
    if (result.suc == 'true') {
      logInfo.startTime = moment(Number(result.runInfo_startTime)).utcOffset('+08:00').format();
      logInfo.endTime = moment(Number(result.runInfo_endTime)).utcOffset('+08:00').format();
      logInfo.time = `${result.runInfo_endTime - result.runInfo_startTime}ms`;
      logInfo.stdout = result.runInfo_stdout;
      logInfo.stderr = result.runInfo_stderr;
    } else {
      logInfo.more = result.err;
    }
    WVLogger.forwardInfo(logInfo);
  }
}

module.exports = {
  SendService
};
