/**
 * Custom ESM External Plugin
 * 模拟 Rolldown 的 esmExternalRequirePlugin 功能
 * 将 external 模块的 require() 调用转换为 import
 */

import type { Plugin } from 'vite';
import MagicString from 'magic-string';

interface Options {
  external: (string | RegExp)[];
  globals?: Record<string, string>;
}

export function customEsmExternalPlugin(options: Options): Plugin {
  const { external, globals = {} } = options;
  
  // 将字符串和正则转换为匹配函数
  const isExternal = (id: string) => {
    return external.some(pattern => {
      if (typeof pattern === 'string') {
        return id === pattern || id.startsWith(pattern + '/');
      }
      return pattern.test(id);
    });
  };

  const replaceRequires = (code: string, filename: string) => {
    if (!code.includes('require')) {
      return null;
    }

    console.log(`\n[Custom ESM] Processing ${filename}`);
    
    const s = new MagicString(code);
    let hasReplacement = false;

    // 匹配所有 require 调用
    const requireRegex = /\brequire\s*\(\s*(['"`])([^'"`]+)\1\s*\)/g;
    let match;

    while ((match = requireRegex.exec(code)) !== null) {
      const moduleName = match[2];
      
      if (isExternal(moduleName)) {
        const globalVar = globals[moduleName];
        
        if (globalVar) {
          console.log(`[Custom ESM] Found require('${moduleName}') -> window.${globalVar}`);
          // 🔑 关键：使用 window.React 而不是 React，避免变量名冲突
          // 这样即使是 var React = require('react') 也会变成 var React = window.React
          s.overwrite(match.index, match.index + match[0].length, `window.${globalVar}`);
          hasReplacement = true;
        }
      }
    }

    if (hasReplacement) {
      return {
        code: s.toString(),
        map: s.generateMap({ hires: true }),
      };
    }

    return null;
  };

  return {
    name: 'custom-esm-external',
    enforce: 'post', // 在其他插件之后运行

    transform(code, id) {
      return replaceRequires(code, id);
    },

    // 🔥 关键：在最终打包阶段再次处理
    renderChunk(code, chunk) {
      return replaceRequires(code, chunk.fileName);
    },
  };
}
