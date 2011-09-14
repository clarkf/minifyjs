exports = module.exports = function jsBeautify (code, options, cb) {
    if (typeof options === 'function') {
        cb = options;
        options = {};
    }
    if (typeof cb !== 'function') {
        throw new Error('js-beautify Error: Callback must be a function!');
    }
    var log = options.log || function () {},
    jsb = require("beautifyjs").js_beautify;
    log("Running js-beautify");
    try {
        code = jsb(code);
        log("Finished beautifying code.");
    } catch (e) {
        cb(e);
    }

    cb(null, code);
}
