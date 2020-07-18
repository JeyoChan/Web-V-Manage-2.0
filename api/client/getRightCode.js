const Router = require('restify-router').Router;

const { GetService } = require('../../service/getService');
const { WVResult } = require('../../utils/WVResultUtils');
const { WVLogger } = require('../../utils/WVLog');
const router = new Router();

router.get('', (req, res, next) => {
  if (!(req && req.query && req.query.rightCodeName)) {
    res.send(new WVResult(false, '缺少参数'));
    return next();
  }
  const fileName = req.query.rightCodeName;
  const getService = new GetService();
  getService.getRightCode(fileName)
    .then((ret) => {
      res.send(new WVResult(true, ret));
      return next();
    })
    .catch((err) => {
      WVLogger.error('getRightCode failed', err);
      res.send(new WVResult(false, err));
      return next();
    });
});

module.exports = router;
