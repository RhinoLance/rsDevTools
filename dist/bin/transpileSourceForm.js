#!/usr/bin/env node 
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = require("chalk");
const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const sass = require("node-sass");
let targetFile = "123";
const emojis = {
    happy: "🙂",
    skull: "☠️",
    fire: "🔥"
};
var program = new commander_1.Command("transpileSourceForm <targetFile>")
    .version("1.0.0")
    .arguments('<targetFile>')
    .action(target => targetFile = target)
    .option("-t --type [type]", "Specify the type of file to update [ts, html, scss].  If not specified it will transpile all files which match the given targetFile.")
    .option("-nt --no-tag", "Do not 'git tag' this version")
    .parse(process.argv);
function main(source) {
    switch (path.extname(source)) {
        case ".ts":
            processTs(source);
            break;
        case ".scss":
            processScss(source);
            break;
        default:
            processTs(source + ".ts");
            processScss(source + ".scss");
    }
}
function processScss(source) {
    const outputPath = path.join(path.dirname(source), path.basename(source, ".scss")) + "-formReady.css";
    sass.render({
        file: source,
        outFile: outputPath
    }, (err, result) => {
        if (err) {
            targetError(source);
            return;
        }
        fs.writeFile(outputPath, result.css, err => {
            if (err) {
                error("The transpiled file could not be written.");
                return;
            }
            success(path.basename(source) + " was succesfully transpiled.");
        });
    });
}
function processTs(source) {
    fs.readFile(source, 'utf8', (err, data) => {
        if (err) {
            targetError(source);
            return;
        }
        const start = data.indexOf("class");
        const classString = data.substring(start);
        const transpiled = ts.transpileModule(classString, { compilerOptions: {
                module: ts.ModuleKind.ES2015,
                target: ts.ScriptTarget.ES2016
            }
        }).outputText;
        const outputPath = path.join(path.dirname(source), path.basename(source, ".ts")) + "-formReady.js";
        fs.writeFile(outputPath, transpiled, function (err) {
            if (err) {
                error("The transpiled file could not be written.");
                return;
            }
            success(path.basename(source) + " was succesfully transpiled.");
        });
    });
}
function targetError(source) {
    console.error(emojis.fire + " " + chalk_1.default.redBright("The specified target file could not be found at " + source));
    process.exit(1);
}
function success(message) {
    console.log(emojis.happy + " " + chalk_1.default.greenBright(message));
}
function error(message) {
    console.error(emojis.fire + " " + chalk_1.default.redBright(message));
    process.exit(1);
}
try {
    main(targetFile);
}
catch (error) {
    console.error(chalk_1.default.redBright("\nERROR: " + error + "\n"));
    process.exit(1);
}
