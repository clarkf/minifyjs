var assert = require('assert'),
    minify = require('../lib/minify'),
    path = require('path')
    valid = require('fs').readFileSync(path.join(__dirname, 'data/valid.js')).toString(),
    broke = require('fs').readFileSync(path.join(__dirname, 'data/broke.js')).toString();

assert.equal(typeof minify.minify, 'function');
assert.equal(typeof minify.beautify, 'function');

minify.minify(valid, function (err, data) {
    assert.ok(!err);
    assert.equal(typeof data, 'string');
    assert.ok(data.length < valid.length);
});

minify.minify(valid, { engine: 'best' }, function (err, data) {
    assert.ok(!err);
    assert.equal(typeof data, 'string');
    assert.ok(data.length < valid.length);
});

minify.minify(valid, { engine: 'yui' }, function (err, data) {
    assert.ok(!err);
    assert.equal(typeof data, 'string');
    assert.ok(data.length < valid.length);
});

assert.throws(function () {
    minify.minify(valid, { engine: 'notARealEngine' }, function () {});
});

minify.minify(broke, function (err, data) {
    assert.ok(err);
    assert.ok(err.message);
});

minify.minify(broke, { engine: 'best' }, function (err, data) {
    assert.ok(err);
    assert.ok(err.message);
});

minify.minify(broke, { engine: 'yui' }, function (err, data) {
    assert.ok(err);
    assert.ok(err.message);
});


minify.beautify(valid, function (err, data) {
    assert.ok(!err);
    assert.equal(typeof data, 'string');
});

minify.beautify(valid, { engine: 'uglify' }, function (err, data) {
    assert.ok(!err);
    assert.equal(typeof data, 'string');
});

