/// <reference path="typings/node/node.d.ts" />
var fs = require('fs');
// Create a templator thunk.
var templateSettings = {
    varsPattern: /{{[^\w]*(\w+)[^\w]*}}/g
};
var template = function (fmt) {
    var settings = templateSettings;
    return function (bindings) {
        return fmt.replace(settings.varsPattern, function (_, varName) {
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
var readFile = function (path, opts) {
    // TODO catach error
    return fs.readFileSync(path, opts).toString();
};
// Convert snake_case to camelCase.
var camelStr = function (raw) {
    return raw.replace(/\w_(\w)/, function (s) {
        return s.toUpperCase();
    });
};
// Extract file name from file path.
var extractFileName = function (path) {
    // TODO Windows compatiablity.
    var parts = path.split('/'), fullFileName = parts[parts.length - 1].split('.');
    // Ignore file extension.
    fullFileName.pop();
    // Replace all dot with underscore,
    // then convert it to camelCase.
    return camelStr(fullFileName.join('_'));
};
// Clean a string.
var cleanStr = function (raw) {
    // Escape single/double quotes.
    return raw.replace(/(['"])/g, '\\$1');
};
// Parse a file and convert it to a exported variable.
var parseFile = function (path) {
    var varName, exportVar, lines;
    varName = extractFileName(path);
    lines = readFile(path).split("\n").map(function (line) {
        return tmpl.line({ line: cleanStr(line) });
    });
    exportVar = tmpl.exportVar({
        name: varName,
        lines: lines.join(',')
    });
    return exportVar;
};
// Compile a module from given files.
var compile = function (modName, files) {
    var variables = files.map(parseFile);
    return tmpl.mod({
        name: camelStr(modName),
        vars: variables.join("\n")
    });
};
// Run under cli with process.argv.
exports.runARGV = function (args) {
    // Skip `node` & script name.
    args = args.slice(2);
    if (args.length < 2) {
        // TODO Improve interface.
        console.error('module name and files required.');
        process.exit(1);
    }
    console.log(compile(args[0], args.slice(1)));
};
