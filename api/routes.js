const Router = require('restify-router').Router;

const apiRoutes = require('./client/routes');
const dockerRoutes = require('./container/routes');

const router = new Router();
router.add('/api', apiRoutes);
router.add('/docker', dockerRoutes);

module.exports = router;
