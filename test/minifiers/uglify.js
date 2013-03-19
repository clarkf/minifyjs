var expect = require('expect.js'),
    sinon = require('sinon'),
    fs = require('fs'),
    minify = require('../../'),
    uglify = require('uglify-js');
    
function fixture(name) {
    var path = __dirname + "/../fixtures/" + name;
    return fs.createReadStream(path);
}
    
describe("MinifyJS", function () {
    describe("`uglify` minifier", function () {
        it("should return the code", function (done) {
            sinon.spy(uglify, 'minify');
            minify.minify(fixture("valid.js"), {
                engine: 'uglify'
            }, function (err, data) {
                if (err)
                    throw err;

                expect(data).to.be.a('string');
                expect(uglify.minify.called).to.be(true);
                uglify.minify.restore();
                done();
            })
        });
        
        // Level 0 = mangle: false
        it("should respect level = 0", function (done) {
            sinon.stub(uglify, 'minify').returns('');
            minify.minify(fixture("valid.js"), {
                engine: 'uglify',
                level: 0
            }, function (err, data) {
                if (err)
                    throw err;
                var opts = uglify.minify.getCall(0).args[1];
                uglify.minify.restore();
                expect(opts.mangle).to.be(false);
                done();
            });
        });
        
        // Level 1 = mangle: false
        it("should respect level = 1", function (done) {
            sinon.stub(uglify, 'minify').returns('');
            minify.minify(fixture("valid.js"), {
                engine: 'uglify',
                level: 1
            }, function (err, data) {
                if (err)
                    throw err;
                var opts = uglify.minify.getCall(0).args[1];
                uglify.minify.restore();
                expect(opts.mangle).to.be(false);
                done();
            });
            
        });
        
        // Level 2 = mangle: true
        it("should respect level = 2", function (done) {
            sinon.stub(uglify, 'minify').returns('');
            minify.minify(fixture("valid.js"), {
                engine: 'uglify',
                level: 2
            }, function (err, data) {
                if (err)
                    throw err;
                var opts = uglify.minify.getCall(0).args[1];
                uglify.minify.restore();
                expect(opts.mangle).not.to.be(false);
                done();
            });
        });
        
        it("should return an error if applicable", function (done) {
            sinon.stub(uglify, 'minify').throws(new Error());
            minify.minify(fixture("valid.js"), {
                engine: 'uglify'
            }, function (err, data) {
                uglify.minify.restore();
                expect(err).to.be.an(Error);
                done();
            });
        })
    });
});