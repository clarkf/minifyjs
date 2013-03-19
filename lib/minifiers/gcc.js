exports = module.exports = function gcc(stream, options, cb) {
    var levels = [
        "WHITESPACE_ONLY"
      , "SIMPLE_OPTIMIZATIONS"
      , "ADVANCED_OPTIMIZATIONS"
    ],
    code = "";
    
    stream.on('data', function (data) {
        code += data.toString();
    });
    
    stream.on('end', function () {
        if (typeof options === 'function') {
            cb = options;
            options = {};
        }
        var gcc = require("closure-compiler").compile,
            gcc_opts = {};
        options.level = options.level || 0;
        options.level = levels[options.level];
        gcc_opts.compilation_level = options.level;
        delete options.level;
        gcc(code, gcc_opts, cb);
    });
};
