var fs = require('fs'),
    Step = require('step'),
    path = require('path');
exports = module.exports = function best (code, options, cb) {
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
            console.log('Loaded %s minifiers.', minifiers.length);
        },
        function sendMinifiers() {
            console.log(arguments);
            var group = this.group();
            minifiers.forEach(function (m) {
                console.log('Sending out minifier');
                m(code, options, group());
            });
        },
        function filterMinifiers(errs, results) {
            console.log('Got results');
            console.log(errs);
            console.log(results);
        }
    );
};
