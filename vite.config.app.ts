import { defineConfig, loadEnv, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Web 应用打包配置 - 默认打包 app.tsx
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
        drop: isProd ? ["console"] : [],
      },
    },
    server: {
      port: Number(PORT || 8080),
    },
    build: {
      // Web 应用打包目录
      outDir: "./build",
      // 压缩
      minify: isProd,
      rollupOptions: {
        input: {
          app: path.resolve(__dirname, "index.html"),
        },
      },
    },
  };
});

