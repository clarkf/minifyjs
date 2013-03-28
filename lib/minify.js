/*jslint node: true */
var fs = require('fs'),
    path = require('path'),
    minifiersPath = path.join(__dirname, "minifiers"),
    beautifiersPath = path.join(__dirname, "beautifiers");

exports = module.exports;

// Expose the version
exports.version = "0.2.0";

// Set the default options
exports.defaults = {
    minify: "best",
    beautify: "js-beautify"
};

// Create the `minifiers`/`beautifiers` hashes
exports.minifiers = {};
exports.beautifiers = {};

// Fill the `minifiers` hash with available minifiers.
fs.readdirSync(minifiersPath).forEach(function (file) {
    if (!(/.js$/i.test(file)))
        return;
    var name = path.basename(file, '.js'),
        modulePath = path.join(minifiersPath, file);
    exports.minifiers[name] = require(modulePath);
});

// Fill the `beautifiers` hash with available minifiers.
fs.readdirSync(beautifiersPath).forEach(function (file) {
    if (!(/.js$/i.test(file)))
        return;
    var name = path.basename(file, '.js'),
        modulePath = path.join(beautifiersPath, file);
    exports.beautifiers[name] = require(modulePath);
});

/**
 * Calls an engine. This is agnostic as to whether it is a minification or
 * beautification operation. The options hash will be passed to the engine
 * (where applicable).
 *
 * @param {String} operation
 * @param {ReadableStream} input
 * @param {Object} options
 * @param {Function} callback
 */
exports.execute = function (operation, input, options, callback) {
    // Normalize arguments -- allow omission of options hash
    if (typeof options == 'function') {
        callback = options;
        options = {};
    }
    options = options || {};

    if (typeof callback != 'function') {
        throw new Error("Must provide a callback function");
    }
    if (!input.readable) {
        throw new Error("Input must be a readable stream");
    }

    // Lookup engine
    var engineName = options.engine || exports.defaults[operation],
        enginePath = operation == 'minify' ? 'minifiers' : 'beautifiers',
        engine = exports[enginePath][engineName];
    
    // Ensure engine is available
    if (typeof engine != 'function') {
        throw new Error("Could not find engine called '" + engineName +
            "' for operation " + operation + "");
    }
    
    // Execute engine
    engine(input, options, callback);
};

/**
 * An alias for executing a minification operation.
 */
exports.minify = function (input, options, callback) {
    return exports.execute('minify', input, options, callback);
};

/**
 * An alias for executing a beautification operation.
 */
exports.beautify = function (input, options, callback) {
    return exports.execute('beautify', input, options, callback);
};