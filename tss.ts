/// <reference path="typings/node/node.d.ts" />

import fs = require('fs');

interface TemplatorFunc {
    (bindings: { [x:string]: any }): string
}

// Create a templator thunk.
var templateSettings = {
    varsPattern: /{{[^\w]*(\w+)[^\w]*}}/g
};

var template = (fmt: string) => {
    var settings = templateSettings;

    return (bindings: { [x:string]: any }) => {
        return fmt.replace(settings.varsPattern, (_, varName) => {
            return bindings[varName];
        });
    };
};

// Module tempalte.
var tmpl = {
    mod: template('module {{ name }} {\n {{ vars }} \n}'),
    exportVar: template('export var {{ name }} = [{{ lines }}].join("\\n");'),
    line: template('"{{ line }}"')
};


// Read file's content.
var readFile = (path: string, opts?: any) => {
    // TODO catach error
    return fs.readFileSync(path, opts).toString();
};


// Convert snake_case to camelCase.
var camelStr = (raw: string) => {
    return raw.replace(/\w_(\w)/, (s) => { return s.toUpperCase(); });
};


// Extract file name from file path.
var extractFileName = (path: string) => {
    // TODO Windows compatiablity.
    var parts = path.split('/'),
        fullFileName = parts[parts.length - 1].split('.');

    // Ignore file extension.
    fullFileName.pop();

    // Replace all dot with underscore,
    // then convert it to camelCase.
    return camelStr(fullFileName.join('_'));
};


// Clean a string.
var cleanStr = (raw: string) => {
    // Escape single/double quotes.
    return raw.replace(/(['"])/g, '\\$1');
};


// Parse a file and convert it to a exported variable.
var parseFile = (path: string) => {
    var varName: string,
        exportVar: string,
        lines: string[];

    varName = extractFileName(path);
    lines = readFile(path).split("\n").map((line) => {
        return tmpl.line({ line: cleanStr(line) });
    });
    exportVar = tmpl.exportVar({
        name: varName,
        lines: lines.join(',')
    });

    return exportVar;
};


// Compile a module from given files.
var compile = (modName: string, files: string[]) => {
    var variables = files.map(parseFile);

    return tmpl.mod({
        name: camelStr(modName),
        vars: variables.join("\n")
    });
};


// Run under cli with process.argv.
export var runARGV = (args: string[]) => {
    // Skip `node` & script name.
    args = args.slice(2);

    console.log(compile(args[0], args.slice(1)));
};
