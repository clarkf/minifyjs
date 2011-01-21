/*jslint white: true, onevar: true, undef: true, newcap: true, nomen: true,
regexp: true, plusplus: true, bitwise: true, maxerr: 50, indent: 4 */
/*globals exports: true, require: false*/
var defaultOptions = {
        log: function () {},
        level: 2
    },
    minifyOptions = {
        engine: 'best'
    },
    beautifyOptions = {
        engine: 'js-beautify'
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

//Minifier core
exports.engines = {
    'minify': require('minifyjs/minify_engines').minify_engines,
    'beautify': require('minifyjs/beautify_engines').beautify_engines
};

exports.minify = function (code, options, cb) {
    if (typeof options === 'function') {
        cb = options;
        options = {};
    }
    options = extend({}, defaultOptions, minifyOptions, options);
    //Call the engine
    return this.run_engine(this.engines.minify, options.engine, code, options, cb);
};

exports.beautify = function (code, options, cb) {
    if (typeof options === 'function') {
        cb = options;
        options = {};
    }
    options = extend({}, defaultOptions, beautifyOptions, options);
    //Call the engine
    return this.run_engine(this.engines.beautify, options.engine, code, options, cb);
};

exports.run_engine = function (list, engine, code, options, cb) {
    //If our engine doesn't exist, show an error!
    if (typeof(list[engine]) !== 'function') {
        throw new Error("Couldn't locate engine " + engine);
    }

    //Check to make sure the callback is valid
    if (typeof cb !== 'function') {
        throw new Error("Callback must be a function!");
    }

    return list[engine](code, options, cb);
};
