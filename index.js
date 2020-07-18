const restify = require('restify');
const { plugins } = restify;

const routes = require('./api/routes');
// const { pathBuild } = require('./utils/WVTools');

// pathBuild();

const httpOptions = {
  name: 'Web-V',
  version: '1.0.0' 
};

const setUpServer = (server) => {
  server.use(plugins.bodyParser());
  server.use(plugins.queryParser());
  server.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return next();
  });
  routes.applyRoutes(server);
}

const server = restify.createServer(httpOptions);
setUpServer(server);

server.listen(process.env.SERVER_PORT || 8000, function() {
  console.log('%s listening at %s', server.name, server.url);
});