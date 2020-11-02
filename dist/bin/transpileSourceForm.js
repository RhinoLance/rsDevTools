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
let formVersion = "";
const emojis = {
    happy: "🙂",
    skull: "☠️",
    fire: "🔥"
};
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
function main(source, version = "") {
    switch (path.extname(source)) {
        case ".ts":
            processTs(source, formVersion);
            break;
        case ".scss":
            processScss(source, formVersion);
            break;
        case ".html":
            processHtml(source, formVersion);
            break;
        default:
            processTs(source + ".ts", formVersion);
            processScss(source + ".scss", formVersion);
            processHtml(source + ".html", formVersion);
    }
}
function processHtml(source, version) {
    const outputPath = path.join(path.dirname(source), path.basename(source, ".html")) + "-formReady.html";
    fs.readFile(source, 'utf8', (err, data) => {
        if (err) {
            targetError(source);
            return;
        }
        const output = getVersionComment(version, "html") + data;
        fs.writeFile(outputPath, output, function (err) {
            if (err) {
                error("The transpiled file could not be written.");
                return;
            }
            success(path.basename(source) + " was succesfully transpiled.");
        });
    });
}
function processScss(source, version) {
    const outputPath = path.join(path.dirname(source), path.basename(source, ".scss")) + "-formReady.css";
    sass.render({
        file: source,
        outFile: outputPath
    }, (err, result) => {
        if (err) {
            targetError(source);
            return;
        }
        const output = getVersionComment(version, "css") + result.css;
        fs.writeFile(outputPath, output, err => {
            if (err) {
                error("The transpiled file could not be written.");
                return;
            }
            success(path.basename(source) + " was succesfully transpiled.");
        });
    });
}
function processTs(source, version) {
    fs.readFile(source, 'utf8', (err, data) => {
        if (err) {
            targetError(source);
            return;
        }
        const start = data.indexOf("class");
        const classString = data.substring(start);
        let transpiled = ts.transpileModule(classString, { compilerOptions: {
                module: ts.ModuleKind.ES2015,
                target: ts.ScriptTarget.ES2016
            }
        }).outputText;
        transpiled = cleanExportClassStatements(transpiled);
        transpiled = cleanEmptyExportStatements(transpiled);
        const output = getVersionComment(version, "js") + transpiled;
        const outputPath = path.join(path.dirname(source), path.basename(source, ".ts")) + "-formReady.js";
        fs.writeFile(outputPath, output, function (err) {
            if (err) {
                error("The transpiled file could not be written.");
                return;
            }
            success(path.basename(source) + " was succesfully transpiled.");
        });
    });
}
function cleanExportClassStatements(jsSrc) {
    return jsSrc.replace(/export class/g, "class");
}
function cleanEmptyExportStatements(jsSrc) {
    return jsSrc.replace(/export {};/g, "");
}
function getVersionComment(version, fileType) {
    if (!version) {
        return "";
    }
    let template = "";
    switch (fileType) {
        case "html":
            template = "<!-- PLACEHOLDER -->";
            break;
        case "css":
        case "js":
        case "ts":
            template = "/* PLACEHOLDER */";
    }
    const output = template.replace("PLACEHOLDER", `Version: ${version}`);
    return output + "\n\n";
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
    main(targetFile, formVersion);
}
catch (error) {
    console.error(chalk_1.default.redBright("\nERROR: " + error + "\n"));
    process.exit(1);
}
