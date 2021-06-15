#!/usr/bin/env node 
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = require("chalk");
const fs = require("fs");
const path = require("path");
const ModuleProcessor_1 = require("../Classes/ModuleProcessor");
const SourceReader_1 = require("../Classes/SourceReader");
let configFile = "123";
const emojis = {
    happy: "🙂",
    skull: "☠️",
    fire: "🔥"
};
var program = new commander_1.Command("transpileSourceForm <configFile>")
    .version("1.0.0")
    .arguments('<configFile>')
    .action((configFile) => {
    configFile = configFile;
})
    .option("-c --config <string>", "Specify the configuration to run.  If not specified it will use the default configuration.")
    .parse(process.argv);
try {
    main(configFile, program.config);
}
catch (error) {
    fatal(error + "\n");
    process.exit(1);
}
function success(message) {
    console.log(emojis.happy + " " + chalk_1.default.greenBright(message));
}
function error(message) {
    console.error(emojis.fire + " " + chalk_1.default.redBright(message));
}
function fatal(message) {
    console.error(emojis.skull + " " + chalk_1.default.redBright(message));
    process.exit(1);
}
function main(configPath, configName) {
    const config = getConfig(configPath, configName);
    const processor = new ModuleProcessor_1.ModuleProcessor(config);
    const promiseList = [];
    config.componentMap.map(v => {
        success(`Retrieving source for ${v.componentName}`);
        const reader = new SourceReader_1.SourceReader(v.sourceFolder);
        const parts = reader.getSourceParts(v.componentName);
        success(`Updating module class ${v.classId}`);
        promiseList.push(processor.updateClass(v.classId, parts));
    });
    Promise.all(promiseList)
        .then(result => {
        success(`Pushing module to server: ${config.name}`);
        return processor.pushModuleToServer();
    })
        .then(result => {
        success(`Module succesfully saved to server: ${config.name}`);
    })
        .catch(ex => error("Error: " + ex));
}
function getConfig(configPath, configName) {
    let jsonPath;
    if (configPath) {
        jsonPath = path.join('.//', 'rhinospect.conf.json');
    }
    else {
        jsonPath = path.join(__dirname, '..', 'rhinospect.conf.json');
    }
    let config;
    try {
        var jsonString = fs.readFileSync(jsonPath, 'utf8');
        var configFileObj = JSON.parse(jsonString);
        config = configFileObj.publishConfigurationList.find(v => v.name == (configName !== null && configName !== void 0 ? configName : "default"));
    }
    catch (ex) {
        fatal(`There was an error reading the configuration file.  Please ensure that you either specify a file path, or have a rhinospect.conf.json in your project's root folder.  Error: ${ex.message}`);
    }
    if (!config) {
        throw ("The specified config could not be found, or there is no default configuration.");
    }
    return config;
}
//# sourceMappingURL=uploadSourceFormContent.js.map