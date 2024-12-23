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
npx transpileSourceForm <targetFile> <suffix> [version]
```

**targetFile** should contain the path to one of the Component's source files.  
If you need to transpile a .css, .html and .js of the same filename, you may ommit the extension and it will do all three.
**suffix** will be appended to the transpiled filename.
**version** will be appended to the top of each output file as a comment.

e.g. The following command will transpile all component files, and append "1.0.0" at the top of each file.

```bash
node transpileSourceForm ./src/app/components/gogo/gogo.component _uploadReady 1.0.0

OUTPUT
🙂 gogo.component.scss was succesfully transpiled.
🙂 gogo.component.ts was succesfully transpiled.
🙂 gogo.component.html was succesfully transpiled.
```

Note: If the command is used in a script from your package.json, using %npm_package_version% in place of the "version" argument will insert the npm package version of the host project.

## PatchModule

This command will create or update a class on an existing RhinoSpect module.  It requires a configuration file, RhinoSpect.conf.json found in your project root, which contains a publishConfigurationList as defined by the [IRhinoSpectConfigList](Classes/IRhinoSpectConfigList.ts) interface.

The command will use the PatchList entries of the configuration to, in order, perform a search and replace on the template file, replacing the key with the contents of the corresponding file.

### Usage

```bash
npx patchModule -c <configuration_name> [configuration_file]
```

**configuration_name** should correspond with a the name of a configuration in the configuration file (rhinospect.conf.json).

**configuration_file** provides the path to an alternative condiguration file.

e.g. The following command will patch the module as defined by the TreeHouse section of the configuration file, with the example rhinospect.conf.json and markerDef.json files below.

```bash
npx uploadSourceFormContent -c TreeHouse01

OUTPUT
Reading local source files for HeliNests
Loading template file for HeliNests
Loading patch file for "__rsp_markerDef__"
🙂 Patch successfull
Loading patch file for "__rsp_html__"
🙂 Patch successfull
Loading patch file for "__rsp_css__"
🙂 Patch successfull
Loading patch file for "__rsp_js__"
🙂 Patch successfull
🙂 All patches applied
Checking that the patched template is valid JSON
🙂 Template is valid JSON
Retrieving module from server, and patching HeliNests class
🙂 Module patched successfully
Pushing module to server: LocalDev
🙂 Module succesfully saved to server
```

e.g. **rhinospect.conf.json**

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
                              "templateFilePath": "./src/rsClasses/template.json",
                              "patchList": [
                                   { "key": "\"__rsp_markerDef__\"", "filePath": "./src/rsClasses/markerDef.json" },
                                   { "key": "\"__rsp_html__\"", "filePath": "./src/rsClasses/TreeHouse.form-uploadReady.html", "stringify": true },
                                   { "key": "\"__rsp_css__\"", "filePath": "./src/rsClasses/TreeHouse.form-uploadReady.css", "stringify": true },
                                   { "key": "\"__rsp_js__\"", "filePath": "./src/rsClasses/TreeHouse.form-uploadReady.js", "stringify": true },

                                   
                              ]
                         }
                    ]
               }
          ]
     }
```


e.g. **markerDef.json**

```json
    {
        "type": "source",
        "icon": "__rsp_markerDef__",
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
        "source": { 
          "html": "__rsp_html__", 
          "javascript": "__rsp_js__", 
          "css": "__rsp_css__" 
         }
     }
```

### Notes

Any typescript classes being patched should be transpiled with the __transpileSourceForm__ command to ensure only the required javascript component is submitted.

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
npx uploadSourceFormContent -c <configuration name>
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

# Development Notes
If you want to make changes to this package whilst testing with an existing project, you can do so by:

1. Clone this repo

2. From your project, install this package with NPM as usual.  
     ```npm i -D github:RhinoLance/rsDevTools```

3. Once installed, delete the package's folder within node_modules.  
     ```rm -r ./node_modules/rs-dev-tools```

4. Create a symlink of the rsDevTools clone to the node_modules folder.  
```New-Item -Path ./node_modules/rs-dev-tools -ItemType SymbolicLink -Value C:\Users\lance\source\repos\rsDevTools```

You can now edit this package whilst testing against your other project.
