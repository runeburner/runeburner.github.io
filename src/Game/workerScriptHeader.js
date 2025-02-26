Object.freeze(self);

const world = (() => {
  const requests = {};
  onmessage = ({ data }) => requests[data.requestID]?.(data.data);
  const SEND = (command, args) => {
    return new Promise((res) => {
      const requestID = crypto.randomUUID();
      requests[requestID] = res;
      postMessage({ requestID, command, args });
    });
  };

  const proxyHandler = {
    get:
      (_, prop) =>
      (...args) =>
        SEND(prop, args),
  };

  const world = new Proxy({}, proxyHandler);

  navigator.locks.request(
    self.name,
    () => new Promise(() => world.WORKER_READY())
  );

  return Object.freeze(world);
})();

const run = (f) => f().finally(close);
