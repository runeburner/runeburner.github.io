// We have to declare that we can declare a global MonacoEnvironment for typescript to be happy
declare interface Window {
  MonacoEnvironment: {
    getWorker(_: unknown, label: string): Worker | Promise<Worker>;
  };
}
