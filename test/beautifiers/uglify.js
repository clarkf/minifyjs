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
    describe("`uglify` beautifier", function () {
        it("should return the code", function (done) {
            sinon.spy(uglify, 'parse');
            minify.beautify(fixture("valid.js"), {
                engine: 'uglify'
            }, function (err, data) {
                if (err)
                    throw err;

                expect(data).to.be.a('string');
                expect(uglify.parse.called).to.be(true);
                uglify.parse.restore();
                done();
            })
        });
        
        it("should throw a meaningful error if code is invalid", function (done) {
            minify.beautify(fixture('broke.js'), {
                engine: 'uglify'
            }, function (err, data) {
                expect(err).to.be.ok();
                done();
            });
        });
    });
});