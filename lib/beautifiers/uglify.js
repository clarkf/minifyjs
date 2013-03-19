var uglify = require('uglify-js');

exports = module.exports = function uglify_handler(stream, options, cb) {
    var code = "";
    stream.on('data', function (d) {
        code += d.toString();
    });
    
    stream.on('end', function () {
        var output, toplevel;
        // Quiet errors
        uglify.AST_Node.warn_function = null;

        try {
            output = uglify.OutputStream({ beautify: true });
            toplevel = uglify.parse(code, {
                filename: null,
                toplevel: null
            });
            toplevel.print(output);
            output = output.get();
        } catch (e) {
            return cb(e);
        }
        cb(null, output);
    });
};
