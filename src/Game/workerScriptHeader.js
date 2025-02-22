const world = (() => {
  const requests = {};
  const workerID = self.name;
  onmessage = ({ data }) => {
    requests[data.requestID](data.data);
  };
  const SEND = (command, args) => {
    return new Promise((res) => {
      const requestID = crypto.randomUUID();
      requests[requestID] = res;
      postMessage({
        workerID,
        requestID,
        command,
        args,
      });
    });
  };

  const obj = Object.freeze(
    new Proxy(
      {},
      {
        get(_, prop) {
          return (...args) => SEND(prop, args);
        },
      }
    )
  );

  navigator.locks.request(name, () => {
    obj.WORKER_READY();
    return new Promise(() => {});
  });

  return obj;
})();

const run = (f) => f().finally(close);
