var fs = require('fs'),
path = require('path'),
assert = require('assert'),
best = require(path.join(__dirname, '../lib/minifiers/best'));

back = 2;

//test #1 -- something that works
best('alert();', function (err, data) {
    console.log('Heard back from working.');
    assert.equal(err, null,"Best returned an error when it shouldn't. " + err);
    assert.equal(typeof data, 'string', "Best didn't return a string! It returned a " + Object.prototype.toString.call(data));
    back--;
});
//test #2, something that doesn't work
best('))((', function (err, data) {
    console.log('Heard back from broken.');
    assert.ok(err, "Best didn't return an error!");
    assert.ok(!data, "Best didn't return no data! " + Object.prototype.toString.call(data));
    back--;
});
