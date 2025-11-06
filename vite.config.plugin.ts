import { defineConfig, loadEnv, normalizePath, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dts from "vite-plugin-dts";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default defineConfig((config): UserConfig => {
  process.env = {
    ...process.env,
    ...loadEnv(config.mode, process.cwd(), ["PORT"]),
  };
  const { PORT } = process.env;
  const isProd = config.mode === "production";
  return {
    resolve: {
      alias: [
        {
          find: "~antd",
          replacement: "antd",
        },
        {
          find: "@",
          replacement: path.resolve(__dirname, "src"),
        },
      ],
    },
    plugins: [
      react(),
      dts({
        entryRoot: "./src",
        outDir: ["./dist/es", "./dist/lib"],
        tsconfigPath: "./tsconfig.json",
      }),
    ],
    css: {
      modules: {
        localsConvention: "camelCaseOnly",
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        },
      },
    },
    optimizeDeps: {
      holdUntilCrawlEnd: true,
      esbuildOptions: {
        drop: ["console"],
      },
    },
    server: {
      port: Number(PORT || 8080),
    },
    build: {
      //打包文件目录
      outDir: "./dist",
      //压缩
      minify: false,
      rollupOptions: {
        input: "./src/plugin/index.tsx",
        external: [
          "antd",
          "antdv5",
        ],
        plugins: [nodeResolve()],
        output: [
          {
            //打包格式
            format: "es",
            preserveModulesRoot: "src",
            inlineDynamicImports: true, 
            exports: "named",
            entryFileNames: "plugin.js",
            //配置打包根目录
            dir: "./dist/es",
          },
          {
            //打包格式
            format: "cjs",
            //打包后文件名
            entryFileNames: "[name].js",
            exports: "named",
            //配置打包根目录
            dir: "./dist/lib",
          },
        ],
      },
      lib: {
        entry: ["./src/plugin/index.tsx"],
      },
    },
  };
});
