var fs = require('fs'),
    path = require('path'),
    assert = require('assert'),
    MINIFIER_DIR = path.join(__dirname, '../lib/minifiers');

fs.readdir(path.join(__dirname, '..', 'lib/minifiers/'), function (err, files) {
    var minifiers = [];
    files = files.filter(function (f) {
        return path.basename(f) != 'best.js';
    })
    files.forEach(function (f) {
        console.log('Loading %s...', f);
        minifiers.push(require(path.join(MINIFIER_DIR, f)));
    });
    console.log('Minifiers: %s', files);
    minifiers.forEach(function (m, i) {
        //test #1 -- something that works
        m('alert();', function (err, data) {
            assert.equal(err, null, files[i] + " returned an error when it shouldn't. " + err);
            assert.equal(typeof data, 'string', files[i] + " didn't return a string!");
        });
        //test #2, something that doesn't work
        m('))((', function (err, data) {
            assert.ok(err, files[i] + " didn't return an error!");
            assert.ok(!data, files[i] + " didn't return no data! " + Object.prototype.toString.call(data));
        });
    });
});
