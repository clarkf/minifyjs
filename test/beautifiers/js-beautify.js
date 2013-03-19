var expect = require('expect.js'),
    sinon = require('sinon'),
    fs = require('fs'),
    minify = require('../../'),
    beautify = require('any-beautify');
    
function fixture(name) {
    var path = __dirname + "/../fixtures/" + name;
    return fs.createReadStream(path);
}
    
describe("MinifyJS", function () {
    describe("`js-beautify` beautifier", function () {
        it("should return the code", function (done) {
            sinon.spy(beautify, 'js');
            minify.beautify(fixture("valid.js"), {
                engine: 'js-beautify'
            }, function (err, data) {
                if (err)
                    throw err;

                expect(data).to.be.a('string');
                expect(beautify.js.called).to.be(true);
                beautify.js.restore();
                done();
            })
        });
    });
});