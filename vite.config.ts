import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    checker({
      typescript: {
        tsconfigPath: "./tsconfig.json",
        buildMode: true,
      },
    }),
    svgr({
      svgrOptions: {
        exportType: "default",
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: "**/*.svg",
    }),
  ],
  // build: {
  //   minify: false,
  //   terserOptions: {
  //     compress: false,
  //     mangle: false,
  //   },
  //   sourcemap: "inline",
  // },
});
