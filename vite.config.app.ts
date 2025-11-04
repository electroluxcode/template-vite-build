import { defineConfig, loadEnv, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// const isDev = false
import cdn from "./plugins/vite-plugin-cdn-import/index.ts"
const externalModules = ["react", "react-dom"];
import { customEsmExternalPlugin } from "./plugins/vite-plugin-rolldown-esm";
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
        // 使用自动 JSX transform
      }),
			cdn({
					modules: [
            {
              name: 'react',
              var: 'React',
              path: 'https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js',
              version: '18.3.1',
              pathList: [
                'https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js'
              ],
              cssList: []
            },
            {
              name: 'react-dom',
              var: 'ReactDOM',
              path: 'https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js',
              version: '18.3.1',
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
        external: externalModules,
        output: {
          // 配置 external 模块到全局变量的映射，供 rollup-plugin-external-globals 使用
          globals: {
            'react': 'React',
            'react-dom': 'ReactDOM'
          }
        },
         plugins: [
           // 使用 Rolldown 内置插件，将 external 模块的 require() 转换为 import
           // https://rolldown.rs/builtin-plugins/esm-external-require
           customEsmExternalPlugin({
            external: externalModules,
            globals: {
              'react': 'React',
              'react-dom': 'ReactDOM',
            },
          }),
         ],
      },
    },
  };
});

