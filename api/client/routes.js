const Router = require('restify-router').Router;

const router = new Router();
router.add('/getTutorial', require('./getTutorial'));
router.add('/getInitialCode', require('./getInitialCode'));
router.add('/getRightCode', require('./getRightCode'));
router.add('/run', require('./run'));

module.exports = router;