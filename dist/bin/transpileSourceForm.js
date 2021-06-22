#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs = require("fs");
const path = require("path");
const chalk_1 = require("chalk");
const TranspileProcessor_1 = require("../Classes/TranspileProcessor");
const emojis = {
    happy: "🙂",
    skull: "☠️",
    fire: "🔥"
};
let targetFile = "123";
let formVersion = "";
var program = new commander_1.Command("transpileSourceForm <targetFile> [version]")
    .version("1.0.0")
    .arguments('<targetFile> [version]')
    .action((target, version) => {
    targetFile = target;
    formVersion = version || "";
})
    .option("-t --type <string>", "Specify the type of file to update [ts, html, scss].  If not specified it will transpile all files which match the given targetFile.")
    .option("-nt --no-tag", "Do not 'git tag' this version")
    .parse(process.argv);
try {
    main(targetFile, formVersion);
}
catch (error) {
    displayError("\nERROR: " + error + "\n");
    process.exit(1);
}
function main(source, version = "") {
    const tp = new TranspileProcessor_1.TranspileProcessor();
    switch (path.extname(source)) {
        case ".ts":
            processFile(source, formVersion, tp.processTs);
            break;
        case ".scss":
            processFile(source, formVersion, tp.processScss);
            break;
        case ".html":
            processFile(source, formVersion, tp.processHtml);
            break;
        default:
            processFile(source + ".ts", formVersion, tp.processTs);
            processFile(source + ".scss", formVersion, tp.processScss);
            processFile(source + ".html", formVersion, tp.processHtml);
    }
}
function processFile(source, version, fProcessor) {
    const extMap = new Map([
        [".scss", ".css"],
        [".sass", ".css"],
        [".html", ".html"],
        [".ts", ".js"]
    ]);
    const ext = extMap.get(path.extname(source).toLowerCase());
    const outputPath = path.join(path.dirname(source), path.basename(source, ext)) + `-formReady${ext}`;
    const src = readFile(source);
    const output = fProcessor(src, version);
    writeFile(outputPath, output);
}
function displaySuccess(message) {
    console.log(emojis.happy + " " + chalk_1.default.greenBright(message));
}
function displayError(message) {
    console.error(emojis.fire + " " + chalk_1.default.redBright(message));
    process.exit(1);
}
function readFile(filePath) {
    let data;
    try {
        data = fs.readFileSync(filePath, 'utf8');
    }
    catch (ex) {
        throw (`The specified source file could not be found at ${path.resolve(filePath)}`);
    }
    return data;
}
function writeFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, data);
    }
    catch (ex) {
        throw (`The transpiled file could not be written to ${filePath}`);
    }
}
//# sourceMappingURL=transpileSourceForm.js.map