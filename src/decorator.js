// import dependencies
const { randomUUID } = require('crypto');

// flags
const isUiDisabled = process.env.UI_DISABLED;

// this is ui instance
let ui;

if (!isUiDisabled) {
  // must be here to prevent screen initialization
  const UI = require('./interface');
  ui = new UI();
} else {
  ui = {
    updateGraph: () => {},
  };
}

// this is logger function
function logger (...args) {
  if (isUiDisabled){
    console.log(...args);
  }
}

// this is route decorator
function route(target, { kind, name }) {
  // if it is not method, do nothing and return target
  if (kind !== 'method') {
    return target;
  }

  return async function (req, res) {
    const { statusCode, data } = await target.apply(this, [req, res]);

    res.writeHead(statusCode);
    return res.end(JSON.stringify({ data: data }));
  };
}

// this is response time tracker decorator
function time (target, { kind, name }) {
  // if it is not method, do nothing and return target
  if (kind !== 'method') {
    return target;
  }

  return async function (req, res) {
    const requestStartAt = performance.now();

    const end = target.apply(this, [req, res]);
    const data = {
      reqId: randomUUID,
      name: name,
      method: req.method,
      url: req.url,
    }

    end.finally(() => {
      requestEnded({
        data,
        res,
        requestStartAt,
      });
    });

    return end;
  }
}

// requestEnded function
function requestEnded({ data, res, requestStartAt }) {
  const requestEndAt = performance.now();
  const timeDiff = requestEndAt - requestStartAt;
  const rounded = Math.round(timeDiff);

  data.statusCode = res.statusCode;
  data.data =  res.data;
  data.elapsed = rounded.toFixed(2).concat('ms');

  logger('benchmark', data);

  ui.updateGraph(data.method, rounded);
}

module.exports = {
  route,
  time,
}