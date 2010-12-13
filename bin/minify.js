#! /usr/bin/env node
// -*- js2 -*-

global.sys = require(/^v0\.[012]/.test(process.version) ? "sys" : "util");
var fs = require("fs");
var minify = require("minifyjs");

var options = {
        mode: 'minify',
        level: 3,
        engine: undefined,
        verbose: false,
        output: true            // stdout
};

var args = Array.prototype.slice.call(process.argv, 2);
var filename;

out: while (args.length > 0) {
        var v = args.shift();
        switch (v) {
            case "-b":
            case "--beautify":
                options.mode = 'beautify';
                break;
            case "-l":
            case "--level":
                options.level = Number(args.shift());
                break;
            case "--engine":
            case "-e":
                options.engine = args.shift();
                break;
            case "--verbose":
            case "-v":
                options.verbose = true;
                break;
            case "-o":
            case "--output":
                options.output = args.shift();
                break;
            default:
                filename = v;
                break out;
        }
}

if (filename) {
        fs.readFile(filename, "utf8", function(err, text){
                processIt(text,output);
        });
} else {
        var stdin = process.openStdin();
        stdin.setEncoding("utf8");
        var text = "";
        stdin.on("data", function(chunk){
                text += chunk;
        });
        stdin.on("end", function() {
                processIt(text,output);
        });
}

function output(text) {
        var out;
        if (options.output === true) {
                out = process.stdout;
        } else {
                out = fs.createWriteStream(options.output, {
                        flags: "w",
                        encoding: "utf8",
                        mode: 0644
                });
        }
        out.write(text);
        out.end();
};

// --------- main ends here.

function processIt(code, cb) {
        try {
				minify[options.mode](
					code,
					cb,
					options.engine,
					options.level,
					options.verbose ? sys.error : undefined
				);
        } catch(ex) {
                sys.debug(ex.stack);
                sys.debug(sys.inspect(ex));
                sys.debug(JSON.stringify(ex));
        }
};