var expect = require('expect.js'),
    sinon = require('sinon'),
    fs = require('fs'),
    minify = require('../../'),
    cc = require('closure-compiler');
    
function fixture(name) {
    var path = __dirname + "/../fixtures/" + name;
    return fs.createReadStream(path);
}
    
describe("MinifyJS", function () {
    describe("`gcc` minifier", function () {
        it("should call the engine", function (done) {
            sinon.stub(cc, "compile").yieldsAsync(null, 'code');
            minify.minify(fixture("valid.js"), {
                engine: 'gcc'
            }, function (err, data) {
                if (err)
                    throw err;

                expect(cc.compile.called).to.be.ok();
                cc.compile.restore();
                done();
            })
        });
        
        // level 0 = WHITESPACE_ONLY
        it("should respect level 0", function (done) {
            sinon.stub(cc, "compile").yields(null, "");
            minify.minify(fixture("valid.js"), {
                engine: 'gcc',
                level: 0
            }, function (err, data) {
                if (err) throw err;
                var opts = cc.compile.getCall(0).args[1];
                expect(opts['compilation_level']).to.be('WHITESPACE_ONLY');
                cc.compile.restore();
                done();
            });
        });
        
        // level 1 = SIMPLE_OPTIMIZATIONS
        it("should respect level 1", function (done) {
            sinon.stub(cc, "compile").yields(null, "");
            minify.minify(fixture("valid.js"), {
                engine: 'gcc',
                level: 1
            }, function (err, data) {
                if (err) throw err;
                var opts = cc.compile.getCall(0).args[1];
                expect(opts['compilation_level']).to.be('SIMPLE_OPTIMIZATIONS');
                cc.compile.restore();
                done();
            });
        });
        
        // level 2 = ADVANCED_OPTIMIZATIONS
        it("should respect level 2", function (done) {
            sinon.stub(cc, "compile").yields(null, "");
            minify.minify(fixture("valid.js"), {
                engine: 'gcc',
                level: 2
            }, function (err, data) {
                if (err) throw err;
                var opts = cc.compile.getCall(0).args[1];
                expect(opts['compilation_level']).to.be('ADVANCED_OPTIMIZATIONS');
                cc.compile.restore();
                done();
            });
        });
        
        it('should return an error if applicable', function (done) {
            sinon.stub(cc, "compile").yieldsAsync(new Error());
            minify.minify(fixture("valid.js"), {
                engine: 'gcc'
            }, function (err, data) {
                cc.compile.restore();
                expect(err).to.be.an(Error);
                done();
            });
        })
    });
});