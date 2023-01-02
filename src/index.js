// import dependencies
const { randomUUID } = require('crypto');
const { once } = require('events');
const { createServer } = require('http');

// import decorator
const { route } = require('./decorator');

// mock database
const db = new Map();

@route
class Server {
  static async handler(req, res) {
    if (req.method === 'POST') {
      const data = await once(req, 'data');
      const item = JSON.parse(data);

      item.id = randomUUID();

      db.set(item.id, item);

      res.writeHead(201);
      return res.end(JSON.stringify({ data: item }));
    }

    res.writeHead(200);
    return res.end(JSON.stringify({
      data: [...db.values()],
    }));
  }
}

createServer(Server.handler).listen(3000, () => console.log('Server is running on port 3000')); 