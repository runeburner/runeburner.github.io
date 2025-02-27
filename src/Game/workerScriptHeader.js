const world = (() => {
  const reqMap = {};
  onmessage = ({ data }) => {
    reqMap[data.requestID]?.(data.data);
    delete reqMap[data.requestID];
  };
  let requestID = 0;
  const SEND = (command, args) => {
    return new Promise((res) => {
      requestID++;
      reqMap[requestID] = res;
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
    () => new Promise(() => postMessage({ command: "WORKER_READY" }))
  );

  Object.freeze(self);
  return Object.freeze(world);
})();

const run = (f) => f().finally(close);
