const config = require('./configure')
const server = require('./server');

const port = appConfig.application.port;

server.listen(port);
console.log('Server listens on port '+port)