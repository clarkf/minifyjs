var beautify = require('any-beautify');
exports = module.exports = function jsBeautify(stream, options, cb) {
    var code = "";
    stream.on('data', function (d) {
        code += d.toString();
    });
    
    stream.on('end', function () {
        try {
            code = beautify.js(code);
        } catch (e) {
            cb(e);
        }

        cb(null, code);
    });
};
