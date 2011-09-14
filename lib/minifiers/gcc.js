exports = module.exports = function gcc (code, options, cb) {
    var levels = [
        "WHITESPACE_ONLY"
      , "SIMPLE_OPTIMIZATIONS"
      , "ADVANCED_OPTIMIZATIONS"
    ];

    if (typeof options === 'function') {
        cb = options;
        options = {};
    }
    var gcc = require("closure-compiler").compile;
    options.level = options.level || 0;
    options.level = levels[options.level];
    options['compilation_level'] = options.level;
    delete options.level;

    gcc(code, options, cb);
};
