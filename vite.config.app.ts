import { defineConfig, loadEnv, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// const isDev = false
import cdn from "./plugins/vite-plugin-cdn-import/index.ts"
import commonjs from '@rollup/plugin-commonjs';
// Web 应用打包配置 - 默认打包 app.tsx
export default defineConfig((config): UserConfig => {
  process.env = {
    ...process.env,
    ...loadEnv(config.mode, process.cwd(), ["PORT"]),
  };
  const { PORT } = process.env;
  const isProd = config.mode === "production";
  
  return {
    // 使用相对路径进行打包
    base: "./",
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
      react({
        jsxRuntime: 'classic',
      }),
      commonjs(),
			cdn({
					modules: [
            {
              name: 'react',
              var: 'React',
              path: 'https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js',
              version: '17.0.2',
              pathList: [
                'https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js'
              ],
              cssList: []
            },
            {
              name: 'react-dom',
              var: 'ReactDOM',
              path: 'https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js',
              version: '17.0.2',
              pathList: [
                'https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js'
              ],
              cssList: []
            }
          ]
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
        external: ["react", "react-dom",  "lodash-es", "@tabler/icons-react"],
        output: {
          globals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'lodash-es': 'lodash-es',
            '@tabler/icons-react': 'TablerIconsReact',
          }
        }
      },
    },
  };
});

