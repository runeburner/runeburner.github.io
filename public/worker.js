const world = (() => {
  const workerID = self.name;
  const SEND = (command, args) => {
    return new Promise((res) => {
      const requestID = crypto.randomUUID();
      onmessage = ({ data }) => {
        if (data.workerID !== workerID || data.requestID !== requestID) return;
        res(data.data);
        onmessage = undefined;
      };
      postMessage({
        workerID,
        requestID,
        command,
        args,
      });
    });
  };

  return Object.freeze(
    new Proxy(
      {},
      {
        get(_, prop) {
          return (...args) => SEND(prop, args);
        },
      }
    )
  );
})();
