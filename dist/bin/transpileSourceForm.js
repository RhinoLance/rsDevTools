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
let fileSuffix = "";
var program = new commander_1.Command("transpileSourceForm <targetFile> <suffix> [version]")
    .version("1.0.0")
    .arguments('<targetFile> <suffix> [version]')
    .action((target, suffix, version) => {
    targetFile = target;
    fileSuffix = suffix;
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
    switch (path.extname(source)) {
        case ".ts":
            processFile(source, formVersion, "processTs");
            break;
        case ".scss":
            processFile(source, formVersion, "processScss");
            break;
        case ".html":
            processFile(source, formVersion, "processHtml");
            break;
        default:
            processFile(source + ".ts", formVersion, "processTs");
            processFile(source + ".scss", formVersion, "processScss");
            processFile(source + ".html", formVersion, "processHtml");
    }
}
function processFile(source, version, processorName) {
    const extMap = new Map([
        [".scss", ".css"],
        [".sass", ".css"],
        [".html", ".html"],
        [".ts", ".js"]
    ]);
    const ext = extMap.get(path.extname(source).toLowerCase());
    const fileParts = path.parse(source);
    const outputPath = path.join(fileParts.dir, fileParts.name) + `${fileSuffix}${ext}`;
    const src = readFile(source);
    const tp = new TranspileProcessor_1.TranspileProcessor();
    const output = tp[processorName](src, version);
    writeFile(outputPath, output);
    displaySuccess(`Transpile succesfull for ${outputPath}`);
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
        if (filePath.substring(filePath.length - 5) == ".scss") {
            // If the file is a scss file, try to read it as a css file instead
            const newPath = filePath.substring(0, filePath.length - 4) + "css";
            return readFile(newPath);
        }
        else {
            throw (`The specified source file could not be found at ${path.resolve(filePath)}`);
        }
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