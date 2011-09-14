exports = module.exports = function (code, options, cb) {
    if (typeof options === 'function') {
        cb = options;
        options = {};
    }
    var yui = require("yui-compressor").compile;
    yui(code, cb);
};
