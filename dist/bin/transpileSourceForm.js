#!/usr/bin/env node 
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = require("chalk");
const fs = require("fs");
const path = require("path");
const ts = require("typescript");
let targetFile = "123";
var program = new commander_1.Command("transpileSourceForm <targetFile>")
    .version("1.0.0")
    .arguments('<targetFile>')
    .action(target => targetFile = target)
    .option("-t --type [type]", "Specify the type of file to update [ts, html, scss].  If not specified it will transpile all files which match the given targetFile.")
    .option("-nt --no-tag", "Do not 'git tag' this version")
    .parse(process.argv);
function main(target) {
    fs.readFile(target, 'utf8', (err, data) => {
        if (err) {
            targetError();
            return;
        }
        const start = data.indexOf("class");
        const classString = data.substring(start);
        const transpiled = ts.transpileModule(classString, { compilerOptions: {
                module: ts.ModuleKind.ES2015,
                target: ts.ScriptTarget.ES2016
            }
        }).outputText;
        const outputPath = path.join(path.dirname(target), path.basename(target, ".ts")) + "-formReady.js";
        fs.writeFile(outputPath, transpiled, function (err) {
            if (err) {
                error("The transpiled file could not be written to: " + outputPath);
                return;
            }
            console.log("The file was succesfully transpiled to " + outputPath);
        });
    });
}
function targetError() {
    console.error(chalk_1.default.redBright("The specified target file could not be found"));
    process.exit(1);
}
function error(message) {
    console.error(chalk_1.default.redBright(message));
    process.exit(1);
}
try {
    main(targetFile);
}
catch (error) {
    console.error(chalk_1.default.redBright("\nERROR: " + error + "\n"));
    process.exit(1);
}
