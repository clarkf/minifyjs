var fs = require('fs'),
    Step = require('step'),
    path = require('path'),
    minify = require('../../');
exports = module.exports = function best(stream, options, cb) {
    Step(
        function sendMinifiers() {
            var group = this.group();
            Object.keys(minify.minifiers).forEach(function (m) {
                if (m == 'best')
                    return;
                minify.minifiers[m](stream, options, group());
            });
        },
        function filterMinifiers(errs, results) {
            if (errs) return cb(errs);
            var bestResult = null;
            results.forEach(function (r) {
                if (bestResult === null || r.length < bestResult.length)
                    bestResult = r;
            });
            return cb(null, bestResult);
        }
    );
};
