const Router = require('restify-router').Router;

const { ContainerService } = require('../../service/containerService');
const { WVResult } = require('../../utils/WVResultUtils');
const { WVLogger } = require('../../utils/WVLog');
const router = new Router();

router.get('', (req, res, next) => {
  if (!(req && req.query && req.query.key)) {
    res.send(new WVResult(false, '缺少参数'));
    return next();
  }
  const key = req.query.key;
  const containerService = new ContainerService(key);
  containerService.register()
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
