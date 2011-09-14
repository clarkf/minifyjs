var assert = require('assert'),
    minify = require('../lib/minify'),
    path = require('path')
    valid = require('fs').readFileSync(path.join(__dirname, 'data/valid.js')).toString(),
    broke = require('fs').readFileSync(path.join(__dirname, 'data/broke.js')).toString(),
    helper = require(path.join(__dirname, 'helper'));

expect(2);
assert.equal(typeof minify.minify, 'function');
fulfill();
assert.equal(typeof minify.beautify, 'function');
fulfill();


function returnsValid (err, data) {
    assert.ok(!err);
    assert.equal(typeof data, 'string');
    fulfill();
}

function returnsInvalid (err, data) {
    assert.ok(err);
    assert.ok(err.message);
    fulfill();
}

expect(2);
assert.throws(function () {
    minify.minify(valid, { engine: 'notARealEngine' }, function () {});
});
fulfill();
assert.throws(function () {
    minify.minify(valid, { engine: 'notARealEngine' }, function () {});
});
fulfill();

/*
 *####################################################################
 *## TEST MINIFIERS - VALID
 *####################################################################
 */

//default engine
expect(3);
minify.minify(valid, returnsValid);
minify.minify(valid, { level: 1 }, returnsValid);
minify.minify(valid, { level: 2 }, returnsValid);
//uglify
expect(3);
minify.minify(valid, { engine: 'uglify' }, returnsValid);
minify.minify(valid, { engine: 'uglify', level: 1 }, returnsValid);
minify.minify(valid, { engine: 'uglify', level: 2 }, returnsValid);
//best engine
expect(3);
minify.minify(valid, { engine: 'best' }, returnsValid);
minify.minify(valid, { engine: 'best', level: 1 }, returnsValid);
minify.minify(valid, { engine: 'best', level: 2 }, returnsValid);
//yui
expect(3);
minify.minify(valid, { engine: 'yui' }, returnsValid);
minify.minify(valid, { engine: 'yui', level: 1 }, returnsValid);
minify.minify(valid, { engine: 'yui', level: 2 }, returnsValid);
//gcc
expect(3);
minify.minify(valid, { engine: 'gcc' }, returnsValid);
minify.minify(valid, { engine: 'gcc', level: 1 }, returnsValid);
minify.minify(valid, { engine: 'gcc', level: 2 }, returnsValid);

/*
 *####################################################################
 *## TEST MINIFIERS - INVALID
 *####################################################################
 */
expect(4);
minify.minify(broke, returnsInvalid);
minify.minify(broke, { engine: 'best' }, returnsInvalid);
minify.minify(broke, { engine: 'yui' }, returnsInvalid);
minify.minify(broke, { engine: 'gcc' }, returnsInvalid);

/*
 *####################################################################
 *## TEST BEAUTIFIERS
 *####################################################################
 */
expect(2);
minify.beautify(valid, returnsValid);
minify.beautify(valid, { engine: 'uglify' }, returnsValid);
