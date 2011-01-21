/*jslint white: true, onevar: true, undef: true, newcap: true, nomen: true,
         regexp: true, plusplus: true, bitwise: true, maxerr: 50, indent: 4 */
/*globals exports: true, require: false*/

exports.beautify_engines = {
    'uglify': function (code, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = {};
        }
        if (typeof cb !== 'function') {
            throw new Error('uglify-beautification Error: Callback must be a function!');
        }
        var log = options.log || function () {},
            uglify = require("uglify");
        log("Running UglifyJS's beautification mode.");

        try {
            code = uglify.parser.parse(code);
            log("Parsed code into AST.");
            code = uglify.uglify.gen_code(code, true);
            log("Finished beautifying code.");
        }
        catch (e) {
            cb(e, code);
        }

        cb(null, code);
    },
    'js-beautify': function (code, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = {};
        }
        if (typeof cb !== 'function') {
            throw new Error('js-beautify Error: Callback must be a function!');
        }
        var log = options.log || function () {},
            jsb = require("js-beautify").js_beautify;
        log("Running js-beautify");
        try {
            code = jsb(code);
            log("Finished beautifying code.");
        } catch (e) {
            cb(e, code);
        }

        cb(null, code);
    }
};
