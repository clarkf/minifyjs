var uglify = require('uglify-js');

exports = module.exports = function uglify_handler(stream, options, cb) {
    var code = "";
    stream.on('data', function (data) {
        code += data.toString();
    });
    stream.on('end', function () {
        try {
            var opts = {
                fromString: true
            };
            if (options.level <= 1)
                opts.mangle = false;
            code = uglify.minify(code, opts);
        } catch (e) {
            return cb(e);
        }

        cb(null, code.code);
    });
};
