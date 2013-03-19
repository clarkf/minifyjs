var yui = require('yuicompressor');
exports = module.exports = function (stream, options, cb) {
    var code = "";
    stream.on('data', function (d) {
        code += d.toString();
    });
    
    stream.on('end', function () {
        var opts = {};
        if (options.level < 2) {
            opts.nomunge = true;
            opts['preserve-semi'] = true;
            if (options.level < 1) {
                opts['disable-optimizations'] = true;
            }
        }
        yui.compress(code, opts, function (err, data, extra) {
            return cb(err, data);
        });
    });
};
