var expect = require('expect.js'),
    sinon = require('sinon'),
    minify = require('../'),
    fs = require('fs');

function fixture(name) {
    var path = __dirname + "/fixtures/" + name;
    return fs.createReadStream(path);
}


// Set default minifier to uglify for test speed
minify.defaults.minify = "uglify";

describe("MinifyJS", function () {
    describe(".beautifiers", function () {
        it("should contain all beautifiers", function () {
            ["js-beautify", "uglify"].forEach(function (b) {
                expect(Object.keys(minify.beautifiers).indexOf(b)).not.to.be(-1);
            });
        })
    });

    describe(".minifiers", function () {
        it("should contain all beautifiers", function () {
            ["best", "gcc", "uglify", "yui"].forEach(function (b) {
                expect(Object.keys(minify.minifiers).indexOf(b)).not.to.be(-1);
            });
        })
    });
    
    describe(".minify", function () {
        it("should be a function", function () {
            expect(minify.minify).to.be.a('function');
        });
        
        it("should minify the valid javascript", function (done) {
            minify.minify(fixture("valid.js"), function (err, data) {
                if (err)
                    throw err;
                expect(data).to.be.a('string');
                done();
            })
        });
        
        it("should accept an options hash", function (done) {
            minify.minify(fixture("valid.js"), {
                engine: "uglify",
                level: 1
            }, function (err, data) {
                done();
            })
        })
        
        it("should respect options.engine", function (done) {
            this.timeout(5000);
            sinon.stub(minify.minifiers, "gcc").yields(null, '');
            minify.minify(fixture("valid.js"), {
                engine: 'gcc',
                level: 1
            }, function (err, data) {
                expect(minify.minifiers.gcc.called).to.be.ok();
                minify.minifiers.gcc.restore();
                done();
            })
        });
        
        it("should throw an error if the first argument is not a stream", function () {
            expect(function () {
                minify.minify("var hi;", function () { });
            }).to.throwError(/readable stream/i);
        });
        
        it("should throw an error if a callback is not provided", function () {
            // Without options
            expect(function () {
                minify.minify(fixture("valid.js"))
            }).to.throwError();
            // With options
            expect(function () {
                minify.minify(fixture("valid.js"), {
                    engine: "uglify"
                });
            }).to.throwError();
        })
    });

    describe(".beautify", function () {
        it("should be a function", function () {
            expect(minify.beautify).to.be.a('function');
        });
        
        it("should beautify the valid javascript", function (done) {
            minify.beautify(fixture("valid.js"), function (err, data) {
                if (err)
                    throw err;
                expect(data).to.be.a('string');
                done();
            })
        });
        
        it("should accept an options hash", function (done) {
            minify.beautify(fixture("valid.js"), {
                engine: "js-beautify",
                level: 1
            }, function (err, data) {
                done();
            })
        })
        
        it("should respect options.engine", function (done) {
            sinon.stub(minify.beautifiers, "uglify").yields(null, 'hi');
            minify.beautify(fixture("valid.js"), {
                engine: 'uglify',
                level: 1
            }, function (err, data) {
                expect(minify.beautifiers.uglify.called).to.be.ok();
                minify.beautifiers.uglify.restore();
                done();
            })
        });
        
        it("should throw an error if a callback is not provided", function () {
            // Without options
            expect(function () {
                minify.beautify(fixture("valid.js"))
            }).to.throwError();
            // With options
            expect(function () {
                minify.beautify(fixture("valid.js"), {
                    engine: "uglify"
                });
            }).to.throwError();
        });
        
        it("should throw an error if the first argument is not a stream", function () {
            expect(function () {
                minify.beautify("var hi;", function () { });
            }).to.throwError(/readable stream/i);
        });
    });
});