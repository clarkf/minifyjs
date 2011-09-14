var fs = require('fs'),
    path = require('path'),
    assert = require('assert'),
    BEAUTIFIER_DIR = path.join(__dirname, '../lib/beautifiers');

fs.readdir(BEAUTIFIER_DIR, function (err, files) {
    var beautifiers = [];
    files.forEach(function (f) {
        console.log('Loading %s...', f);
        beautifiers.push(require(path.join(BEAUTIFIER_DIR, f)));
    });
    console.log('Beautifiers: %s', files);
    beautifiers.forEach(function (m, i) {
        //test #1 -- something that works
        m('alert();', function (err, data) {
            assert.equal(err, null, files[i] + " returned an error when it shouldn't. " + err);
            assert.equal(typeof data, 'string', files[i] + " didn't return a string!");
        });
    });
});
