var fs = require('fs'),
    path = require('path');

function listEngines(dir) {
    var files = fs.readdirSync(dir),
        modules = {};
    files.forEach(function (f) {
        if (/.js$/i.test(f)) {
            modules[path.basename(f, '.js')] = (require(path.join(dir, f)));
        }
    });
    return modules;
}

exports = module.exports = {
    beautifiers: listEngines(path.join(__dirname, 'beautifiers')),
    minifiers: listEngines(path.join(__dirname, 'minifiers')),
    beautify: function beautify (code, options, cb) {
        if (!cb) {
            cb = options;
            options = {};
        }

        //Default engine is js-beautify
        var engine = options.engine || 'js-beautify';
        delete options.engine;
        if (!exports.beautifiers[engine]) throw new Error("Couldn't locate engine: '" + engine + "'");

        //Call engine
        exports.beautifiers[engine](code, options, cb);
    },
    minify: function minify (code, options, cb) {
        if (!cb) {
            cb = options;
            options = {};
        }

        //Default engine is uglify
        var engine = options.engine || 'best';
        delete options.engine;
        if (!exports.minifiers[engine]) throw new Error("Couldn't locate engine: '" + engine + "'");

        //Call engine
        exports.minifiers[engine](code, options, cb);
    }
};
