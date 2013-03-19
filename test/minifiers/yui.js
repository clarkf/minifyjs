var expect = require('expect.js'),
    sinon = require('sinon'),
    fs = require('fs'),
    minify = require('../../'),
    yui = require('yuicompressor');
    
function fixture(name) {
    var path = __dirname + "/../fixtures/" + name;
    return fs.createReadStream(path);
}
    
describe("MinifyJS", function () {
    describe("`yui` minifier", function () {
        it("should return the code", function (done) {
            sinon.stub(yui, "compress").yieldsAsync(null, "", "");
            minify.minify(fixture("valid.js"), {
                engine: 'yui'
            }, function (err, data) {
                if (err)
                    throw err;

                expect(data).to.be.a('string');
                yui.compress.restore();
                done();
            })
        });
        
        // Level 0 = nomunge, disable optimizations, preserve semi
        it("should respect level = 0", function (done) {
            sinon.stub(yui, 'compress').yields(null, "", "");
            minify.minify(fixture("valid.js"), {
                engine: 'yui',
                level: 0
            }, function (err, data) {
                if (err)
                    throw err;
                var opts = yui.compress.getCall(0).args[1];
                yui.compress.restore();
                expect(opts.nomunge).to.be(true);
                expect(opts['preserve-semi']).to.be(true);
                expect(opts['disable-optimizations']).to.be(true);
                done();
            });
        });
        
        // Level 1 = nomunge, preserve semi
        it("should respect level = 1", function (done) {
            sinon.stub(yui, 'compress').yields(null, "", "");
            minify.minify(fixture("valid.js"), {
                engine: 'yui',
                level: 1
            }, function (err, data) {
                if (err)
                    throw err;
                var opts = yui.compress.getCall(0).args[1];
                yui.compress.restore();
                expect(opts.nomunge).to.be(true);
                expect(opts['preserve-semi']).to.be(true);
                expect(opts['disable-optimizations']).not.to.be(true);
                done();
            });
        });
        
        // Level 2 = all
        it("should respect level = 2", function (done) {
            sinon.stub(yui, 'compress').yields(null, "", "");
            minify.minify(fixture("valid.js"), {
                engine: 'yui',
                level: 2
            }, function (err, data) {
                if (err)
                    throw err;
                var opts = yui.compress.getCall(0).args[1];
                yui.compress.restore();
                expect(opts.nomunge).not.to.be(true);
                expect(opts['preserve-semi']).not.to.be(true);
                expect(opts['disable-optimizations']).not.to.be(true);
                done();
            });
        });
        
        it("return an error if applicable", function (done) {
            sinon.stub(yui, 'compress').yields(new Error());
            minify.minify(fixture("valid.js"), {
                engine: 'yui'
            }, function (err, data) {
                yui.compress.restore();
                expect(err).to.be.an(Error);
                done();
            });
        });
    });
});