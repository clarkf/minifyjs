exports = module.exports = function uglify_handler (code, options, cb) {
    if (!cb) {
        cb = options;
        options = {};
    }

    uglify = require("uglify-js");


    try {
        code = uglify.parser.parse(code);
        code = uglify.uglify.gen_code(code, true);
    }
    catch (e) {
        return cb(e);
    }

    cb(null, code);
};
