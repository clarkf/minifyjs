var expect = require('expect.js'),
    sinon = require('sinon'),
    fs = require('fs'),
    minify = require('../../');
    
function fixture(name) {
    var path = __dirname + "/../fixtures/" + name;
    return fs.createReadStream(path);
}
    
describe("MinifyJS", function () {
    describe("`best` minifier", function () {
        this.timeout(5000);
        it("should call all other minifiers", function (done) {
            // Set up spies
            Object.keys(minify.minifiers).forEach(function (m) {
                if (m == 'best')
                    return;
                sinon.stub(minify.minifiers, m).yieldsAsync(null, "code");
            });
            
            minify.minify(fixture("valid.js"), {
                engine: 'best'
            }, function (err, data) {
                if (err)
                    throw err;
                
                Object.keys(minify.minifiers).forEach(function (m) {
                    if (m != 'best') {
                        expect(minify.minifiers[m].called).to.be(true);
                        minify.minifiers[m].restore();
                    }
                });
                done();
            })
        });
        
        it("should return the shortest code", function (done) {
            sinon.stub(minify.minifiers, "gcc").yields(null, 'hi');
            sinon.stub(minify.minifiers, "yui").yields(null, 'hi2');
            sinon.stub(minify.minifiers, "uglify").yields(null, 'hi23');
            minify.minify(fixture("valid.js"), {
                engine: 'best'
            }, function (err, data) {
                if (err) {
                    throw err;
                }
                expect(data).to.be('hi');
                minify.minifiers.gcc.restore();
                minify.minifiers.yui.restore();
                minify.minifiers.uglify.restore();
                done();
            });
        });
        
        it('should return an error if applicable', function (done) {
            sinon.stub(minify.minifiers, "gcc").yields(new Error());
            sinon.stub(minify.minifiers, "yui").yields(new Error());
            sinon.stub(minify.minifiers, "uglify").yields(new Error());
            minify.minify(fixture("valid.js"), {
                engine: 'best'
            }, function (err, data) {
                minify.minifiers.gcc.restore();
                minify.minifiers.yui.restore();
                minify.minifiers.uglify.restore();
                expect(err).to.be.an(Error);
                done();
            });
        })
    });
});