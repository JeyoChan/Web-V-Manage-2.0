const Router = require('restify-router').Router;

const { GetService } = require('../../service/getService');
const { WVResult } = require('../../utils/WVResultUtils');
const { WVLogger } = require('../../utils/WVLog');
const router = new Router();

router.get('', (req, res, next) => {
  if (!(req && req.query && req.query.tutorial)) {
    res.send(new WVResult(false, '缺少参数'));
    return next();
  }
  const fileName = req.query.tutorial;
  const getService = new GetService();
  getService.getTutorial(fileName)
    .then((ret) => {
      res.send(new WVResult(true, ret));
      return next();
    })
    .catch((err) => {
      WVLogger.error('getTutorial failed', err);
      res.send(new WVResult(false, err));
      return next();
    });
});

module.exports = router;
