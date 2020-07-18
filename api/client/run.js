const Router = require('restify-router').Router;

const { SendService } = require('../../service/sendService');
const { WVResult } = require('../../utils/WVResultUtils');
const { WVLogger } = require('../../utils/WVLog');
const router = new Router();

router.post('', (req, res, next) => {
  if (!(req && req.body)) {
    res.send(new WVResult(false, '缺少参数'));
    return next();
  }
  const code = req.body;
  const sendService = new SendService(code);
  sendService.runCode()
    .then((ret) => {
      res.send(new WVResult(ret.suc, ret.result));
      return next();
    })
    .catch((err) => {
      WVLogger.error('forwardCode failed', err);
      res.send(new WVResult(false, err));
      return next();
    });
});

module.exports = router;
