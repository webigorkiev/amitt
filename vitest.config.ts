/// <reference types="vitest" />
import * as path from "node:path";
import {defineConfig} from "vitest/config";

process.env.TEST_MODE_APP = "test";

export default defineConfig({
	resolve: {
		alias: [
			{
				find: /^~(.+)/,
				replacement: path.resolve('./node_modules') + '/$1',
			},
			{
				find: /@\/(.*)/,
				replacement: path.resolve('./src') + '/$1',
			},
		],
	},
	plugins: [
	],
	test: {
		root: "./",
		include: ["**/__its__/**/*.(m)?[jt]s?(x)", "**/__tests__/**/*.(m)?[jt]s?(x)", "**/?(*.)+(spec|test).(m)?[jt]s?(x)"],
		exclude: ["**/node_modules/**", "./src/certs/**", "./src/scripts/**", "./src/sql/**", "./src/estimation-client/**"],
		environment: "jsdom",
		globals: true,
		testTimeout: 15000,
		hookTimeout: 15000,
		poolOptions: {
			threads: {
				singleThread: true
			}
		}
	},
});
