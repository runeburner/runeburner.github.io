import { another } from "./another";

const sleep = (n: number) => new Promise((res) => setTimeout(res, n));

(async () => {
  while (true) {
    await sleep(1000);
    console.log("OK");
    another();
  }
})();
