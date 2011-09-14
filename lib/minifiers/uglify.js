exports = module.exports = function uglify_handler (code, options, cb) {
    if (typeof options === 'function') {
        cb = options;
        options = {};
    }
    var uglify = require("uglify-js");

    try {
        code = uglify.parser.parse(code);
        if (options.level > 0) {
            code = uglify.uglify.ast_mangle(code);
        }
        if (options.level > 1) {
            code = uglify.uglify.ast_squeeze(code);
        }
        code = uglify.uglify.gen_code(code);
    } catch (e) {
        return cb(e);
    }

    cb(null, code);
};
