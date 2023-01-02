// this is route decorator
function route(target, { kind, name }) {
  console.log({ target, kind, name });

  // decorator always return a target
  return target;
}

module.exports = {
  route,
}