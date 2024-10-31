# RhinoSpect DevTools

RhinoSpect DevTools are a collection of CLI tools used to aide in the development of custom RhinoSpect modules.

## Installing

For the latest stable version:

```bash
npm install https://github.com/RhinoLance/rsDevTools.git
```

## Transpile Source Form

Where a RhinoSpect form has been developed as an Angular Component, you may use this tool to transpile the component to its respoective .js, .html and .css files for use in a RhinoSpect module class.

### Usage

```bash
node transpileSourceForm <targetFile> [version]
```

**targetFile** should contain the path to one of the Component's source files, without the extension.
**version** will be appended to the top of each output file as a comment.

e.g. The following command will transpile all component files, and append "1.0.0" at the top of each file.

```bash
node transpileSourceForm ./src/app/components/gogo/gogo.component 1.0.0

OUTPUT
🙂 gogo.component.scss was succesfully transpiled.
🙂 gogo.component.ts was succesfully transpiled.
🙂 gogo.component.html was succesfully transpiled.
```

Note: If the command is used in a script from your package.json, using %npm_package_version% in place of the "version" argument will insert the npm package version of the host project.

## UploadSourceFormContent

This command will create or update a class on an existing RhinoSpect module.  It requires a configuration file, RhinoSpect.conf.json found in your project root, which contains a publishConfigurationList as defined by the [IRhinoSpectConfigList](Classes/IRhinoSpectConfigList.ts) interface.

e.g.

```json
    {
          "publishConfigurationList": [
               {
                    "name": "TreeHouse01",
                    "url": "https://go.rhinospect.com/",
                    "serverName": "RhinoSpect prod",
                    "token": "aa185ab3-1261-4581-zv85-12abc8fa1f923",
                    "moduleId": "3e05119b-11a8-4q40-bce4-ad2g5f6f01f2",
                    "classMap": [
                         {
                              "className": "Tree House",
                              "classId": "tree-house",
                              "sourceFolder": "./src/app/components/treeHouse",
                              "componentName": "treeHouse.component",
                              "templateFilePath": "./src/rsClasses/template.json"
                         }
                    ]
               }
          ]
     }
```

The templateFilePath contains the path to a class template file which defines non-form related class values.  The file structure is defined by the [IRhinoSpectClassTemplate](Classes/IRhinoSpectConfigList.ts) interface.

e.g.

```json
    {
        "type": "source",
        "icon": "marker",
        "statusDef": [
            {"value": 0, "text": "Closed", "colour": "#4f372d" },
            {"value": 1, "text": "Open", "colour": "#edc951" },
            {"value": 2, "text": "Pending Close", "colour": "#00a0b0" }
        ],
        "ratingDef": [
            {"value": 1, "text": "Major", "colour": "#d96459" },
            {"value": 2, "text": "Moderate", "colour": "#f2ae72" },
            {"value": 3, "text": "Minor", "colour": "#f2e394" }
        ],
        "ratingDefId": "custom",
        "source": { "html": "", "javascript": "", "css": "" }
    }
```

### UploadSourceFormContent Usage

```bash
node uploadSourceFormContent -c <configuration name>
```

**configuration_name** should correspond with a the name of a configuration in the configuration file (rhinospect.conf.json).

e.g. The following command will transpile all component files, and append "1.0.0" at the top of each file.

```bash
node uploadSourceFormContent -c TreeHouse01

OUTPUT
Retrieving source for treeHouse.component
🙂 Updating module class tree-house
Retrieving module 3e05119b-11a8-4440-bce4-ad84ff6f01f2
🙂 Pushing module to server: TreeHouse01
putting module 3e05119b-11a8-4440-bce4-ad84ff6f01f2
🙂 Module succesfully saved to server: TreeHouse01
```
