var minify = require('../../');
exports = module.exports = function best(stream, options, cb) {
    var results = [],
        errors = [],
        out = Object.keys(minify.minifiers).length - 1,
        back = 0;
    
    Object.keys(minify.minifiers).forEach(function (m) {
        if (m == 'best') return;
        minify.minifiers[m](stream, options, function (err, data) {
            if (err)
                errors.push(err);

            results.push(data);
            back++;
            if (back >= out)
                determineBest(results);
        });
    });
    
    function determineBest(list) {
        if (errors.length > 0) return cb(errors[0]);
        var bestResult = null;
        list.forEach(function (r) {
            if (bestResult === null || r.length < bestResult.length)
                bestResult = r;
        });
        return cb(null, bestResult);
    }
};
