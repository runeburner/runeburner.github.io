import * as esbuild from "esbuild-wasm";

let onDone: () => void = () => undefined;
export const esbuildIsInit: Promise<void> = new Promise(
  (res) => (onDone = res)
);

export const esbuildInit = async (): Promise<void> => {
  return esbuild
    .initialize({
      wasmURL: "/esbuild.wasm",
    })
    .then(onDone);
};

export const transpile = async (
  code: string
): Promise<ReturnType<typeof esbuild.transform>> => {
  return esbuild.transform(code, { loader: "ts" });
};
