// this is route decorator
function route(target, { kind, name }) {
  console.log({ target, kind, name });

  // decorator always return a target
  return target;
}

const { createServer } = require('http');

@route
class Server {
  static async handler(req, res) {
    return res.end('OK');
  }
}

createServer(Server.handler).listen(3000, () => console.log('Server is running on port 3000'));