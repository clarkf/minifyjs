var fs = require('fs'),
    Step = require('step'),
    path = require('path');
exports = module.exports = function best (code, options, cb) {
    if (!cb) {
        cb = options;
        options = {};
    }
    var minifiers = [];
    Step(
        function readMinifiers() {
            fs.readdir(__dirname, this);
        },
        function loadMinifiers(err, files) {
            if (err) throw err;
            files.forEach(function (f) {
                if (path.extname(f).toLowerCase() !== '.js' || path.basename(f) === path.basename(__filename)) return;
                minifiers.push(require('./' + path.basename(f, '.js')));
            });
            this();
        },
        function sendMinifiers() {
            var group = this.group();
            minifiers.forEach(function (m) {
                m(code, options, group());
            });
        },
        function filterMinifiers(errs, results) {
            if (errs) return cb(errs);
            var bestResult = code;
            results.forEach(function (r) {
                if (r.length < bestResult.length) bestResult = r;
            });
            return cb(null, bestResult);
        }
    );
};
