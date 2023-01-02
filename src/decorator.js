// this is route decorator
function route(target, { kind, name }) {
  // if it is not method, do nothing and return target
  if (kind !== 'method') {
    return target;
  }

  return async function (req, res) {
    const {
      statusCode = 200,
      data = null,
    } = await target.apply(this, [req, res]);

    res.writeHead(statusCode);
    return res.end(JSON.stringify({ data: data }));
  };
}

module.exports = {
  route,
}