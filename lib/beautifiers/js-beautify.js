var beautify = require('js-beautify');
exports = module.exports = function jsBeautify(stream, options, cb) {
    var code = "";
    stream.on('data', function (d) {
        code += d.toString();
    });
    
    stream.on('end', function () {
        try {
            code = beautify.js_beautify(code);
        } catch (e) {
            cb(e);
        }

        cb(null, code);
    });
};
