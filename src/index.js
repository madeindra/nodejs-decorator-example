// import dependencies
const { randomUUID } = require('crypto');
const { once } = require('events');
const { createServer } = require('http');

// import decorator
const { route, time } = require('./decorator');

// timer
const { setTimeout } = require('timers/promises');

// mock database
const db = new Map();

class Server {
  @time
  @route // must be first above method
  static async handler(req, res) {
    // this line is to simulate latency
    await setTimeout(parseInt(Math.random() * 100))

    if (req.method === 'POST') {
      const data = await once(req, 'data');
      const item = JSON.parse(data);

      item.id = randomUUID();

      db.set(item.id, item);

      return {
        statusCode: 201,
        data: item,
      };
    }

    return {
      statusCode: 200,
      data: [...db.values()],
    };
  }
}

createServer(Server.handler).listen(3000, () => console.log('Server is running on port 3000')); 