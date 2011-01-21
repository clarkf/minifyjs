/*jslint white: true, onevar: true, undef: true, newcap: true, nomen: true,
regexp: true, plusplus: true, bitwise: true, maxerr: 50, indent: 4 */
/*globals exports: true, require: false*/

var defaultOptions = {
        log: function () {},
        level: 3
    },
    extend = function (target) {
        var sources = Array.prototype.slice.call(arguments, 1),
            s, p;
        for (s = 0; s < sources.length; s += 1) {
            for (p in sources[s]) {
                if (sources[s].hasOwnProperty(p)) {
                    target[p] = sources[s][p];
                }
            }
        }
        return target;
    };

exports.minify_engines = {
    best: function (code, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = {};
        }
        options = extend({}, defaultOptions, options);
        var codes = {},
            counter = 0,
            length = 0,
            list = this,
            i,
            codes_back,
            h = function (engine) {
                return function (error, compiledCode) {
                    counter += 1;
                    if (!error) {
                        codes[engine].code = compiledCode;
                        codes[engine].savings = (code.length - codes[engine].code.length);
                    }
                    codes[engine].end = (new Date()).getTime();
                    codes[engine].time = codes[engine].end - codes[engine].start;
                    codes[engine].error = error;
                    options.log("Code back from " + engine + " in " + (codes[engine].time / 1000).toPrecision(2) + 's');
                    options.log(engine + " saved " + (codes[engine].savings || 'nothing'));
                    if (counter >= length) {
                        codes_back();
                    }
                };
            };
        codes_back = function codes_back() {
            var i,
                smallest;
            for (i in codes) {
                if (codes.hasOwnProperty(i)) {
                    if (!smallest || (codes[i].code && codes[i].code.length < codes[smallest].code.length)) {
                        smallest = i;
                    }
                }
            }
            options.log("Smallest code back from " + smallest);
            options.log("Saved " + codes[smallest].savings + 'b, or ' + ((codes[smallest].savings / code.length) * 100).toPrecision(2) + '%');
            cb(codes[smallest].error, codes[smallest].code);
        };
        for (i in list) {
            if (list.hasOwnProperty(i) && i !== 'best') {
                length += 1;
            }
        }
        for (i in this) {
            if (list.hasOwnProperty(i)) {
                this.length += 1;
                if (i == 'best') {
                    continue;
                }
                options.log("Running " + i);
                codes[i] = codes[i] || {};
                codes[i].start = (new Date()).getTime();
                list[i](code, options, h(i));
            }
        }
    },
    uglify: function (code, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = {};
        }
        options = extend({}, defaultOptions, options);
        var uglify = require("uglify");

        options.log('Running UglifyJS');

        try {
            code = uglify.parser.parse(code);
            if (options.level > 0) {
                options.log("Mangling variable names");
                code = uglify.uglify.ast_mangle(code);
            }
            if (options.level > 1) {
                options.log("Squeezing code");
                code = uglify.uglify.ast_squeeze(code);
            }
            code = uglify.uglify.gen_code(code);
        } catch (e) {
            cb(e, code);
        }

        cb(null, code);
    },
    yui: function (code, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = {};
        }
        options = extend({}, defaultOptions, options);
        var yui = require("yui-compressor").compile;
        yui(code, function (compiledCode) {
            cb(null, compiledCode);
        });
    },
    gcc: function (code, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = {};
        }
        options = extend({}, defaultOptions, options);
        var gcc = require("closure-compiler").compile;

        gcc(code, {
            compilation_level: options.level
        }, function (errors, warnings, code) {
            //Pipe warnings to log
            if (warnings && typeof options.log === 'function') {
                warnings.forEach(function (warning) {
                    options.log(warning);
                });
            }
            //Return errors and code.
            return cb(errors, code);
        });
    }
};
