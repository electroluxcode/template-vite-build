import externalGlobals, { type ModuleNameMap } from "rollup-plugin-external-globals"

import type { HtmlTagDescriptor, Plugin, UserConfig } from "vite"
import { Module } from "./types"



function PluginImportToCDN(options: Options): Plugin[] {
	const {
		modules = [],
		generateCssLinkTag,
	} = options

	let isBuild = false

	const data = modules

	const externalMap: ModuleNameMap = {}

	data.forEach((v) => {
		externalMap[v.name] = v.var
		if (Array.isArray(v.alias)) {
			v.alias.forEach((alias) => {
				externalMap[alias] = v.var
			})
		}
	})
	const plugins: Plugin[] = [
		{
			name: "vite-plugin-cdn-import",
			enforce: "pre",
			config(_, { command }) {
				isBuild = command === "build"

				const userConfig: UserConfig = {
					build: {
						rollupOptions: {
							plugins: [],
						},
					},
				}

				userConfig.build!.rollupOptions!.plugins = [externalGlobals(externalMap) as Plugin]

				return userConfig
			},
			transformIndexHtml(html) {

				const descriptors: HtmlTagDescriptor[] = []
				data.forEach((v) => {
					v.pathList.forEach((url) => {
						const attrs = {
							src: url,
							crossorigin: "anonymous",
						}

						descriptors.push({
							tag: "script",
							attrs,
						})
					})
					v.cssList.forEach((url) => {
						const cusomize = generateCssLinkTag?.(v.name, url) || {}
						const attrs = {
							href: url,
							rel: "stylesheet",
							crossorigin: "anonymous",
							...cusomize.attrs,
						}
						descriptors.push({
							tag: "link",
							...cusomize,
							attrs,
						})
					})
				})

				return descriptors
			},
		},
	]

	return plugins
}

/**
 * @deprecated Pass the package name directly in options.modules instead.
 */
export { PluginImportToCDN as Plugin }

export default PluginImportToCDN
