const path = require("path");
const fs = require("fs-extra");
const { gzipSync } = require('zlib');
const rollup = require("rollup");
const esbuild  = require("rollup-plugin-esbuild");
const {default:dts} = require("rollup-plugin-dts");
const aliasPlugin = require("@rollup/plugin-alias");
const chalk = require("chalk");
const pkg = require("../package.json");
const root = path.resolve("./dist");

// eslint-disable-next-line no-console
const log = console.log;
const external = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
    ...["path", "fs", "fs/promises", "crypto", "dns", "stream", "querystring"]
];

(async() => {
    log(chalk.green.bold("Start build bundle"));
    await fs.remove(root);
    log("Remove dist dir");
    await fs.mkdirp(root);
    await fs.copy("./LICENSE", path.resolve(root, "./LICENSE"));
    await fs.copy("./package.json", path.resolve(root, "./package.json"));
    await fs.copy("./README.md", path.resolve(root, "./README.md"));
    await fs.copy("./docs", path.resolve(root, "./docs"));
    const pkg = await fs.readJson(path.resolve(root, "./package.json"));
    pkg.private = false;
    await fs.writeJson(path.resolve(root, "./package.json"), pkg, {
        spaces: 2
    });
    log("Copy files to dist dir");
    await buildPlugin("./src/index.ts", "./dist/index.js", "cjs");
    await buildPlugin("./src/index.ts", "./dist/index.mjs", "esm");
    log("Build plugin");
    await buildTypes(["./src/index.ts"], root);
    log("Build types client");

    log(chalk.green.bold("Build success"));
    await checkFileSize("./dist/index.mjs");
    await checkFileSize("./dist/index.js");
})();

/**
 * Build bundle by rollup
 * @returns {Promise<void>}
 */
const buildPlugin = async(input, output, format = "cjs") => {
    const bundle = await rollup.rollup({
        input,
        external,
        plugins: [
            aliasPlugin({
                entries: [
                    { find:/^@\/(.*)/, replacement: './src/$1.ts' }
                ]
            }),
            esbuild({
                tsconfig: "./tsconfig.json"
            })
        ]
    });
    await bundle.write({
        format,
        file: output,
        exports: "named"
    });
    await bundle.close();
};

/**
 * Build types
 * @returns {Promise<void>}
 */
const buildTypes = async(input, root) => {
    const bundle = await rollup.rollup({
        input,
        external,
        plugins: [
            aliasPlugin({
                entries: [
                    { find:/^@\/(.*)/, replacement: './src/$1.ts' }
                ]
            }),
            dts()
        ]
    });
    await bundle.write({
        dir: root,
        format: "esm"
    });
    await bundle.close();
};

/**
 * Check size of file
 * @param filePath
 * @returns {Promise<void>}
 */
const checkFileSize = async(filePath) => {

    if(!fs.existsSync(filePath)) {
        return;
    }
    const file = await fs.readFile(filePath);
    const minSize = (file.length / 1024).toFixed(2) + 'kb';
    const gzipped = gzipSync(file);
    const gzippedSize = (gzipped.length / 1024).toFixed(2) + 'kb';

    log(
        `${chalk.gray(
            chalk.bold(path.basename(filePath))
        )} min:${minSize} / gzip:${gzippedSize}`
    );
};