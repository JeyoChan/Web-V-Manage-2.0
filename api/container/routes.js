const Router = require('restify-router').Router;

const router = new Router();
router.add('/register', require('./register'));


module.exports = router;