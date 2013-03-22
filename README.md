# minifyjs — A node minifier

<https://github.com/clarkf/minifyjs>
[![Build Status](https://travis-ci.org/clarkf/minifyjs.png?branch=master)](https://travis-ci.org/clarkf/minifyjs)


`minifyjs` is a Javascript code minifier written for node. It's aim is flexibility.

## Installation


minifyjs is an [npm](http://npmjs.org) package. You should be able to install it using

    npm install minifyjs
    
To install the `minifyjs` command, use

    npm install -g minifyjs

This will install the current stable version. To install the latest development version, clone this repository and install it.

    git clone git://github.com/clarkf/minifyjs.git
    cd minifyjs
    npm install -g

Congratulations! You're half way to the minified files of your dreams.

## Use

You can use minifyjs from the command line.

    minifyjs [arguments] [-b/m] [-i path/input.js] [-o path/output.js]

Possible arguments

* `-b` or `--beautify` — Beautify code. The opposite of minifying code.
* `-m` or `--minify` — Minify code. Available options for the minification engine
* `-e` or `--engine E` — Specify an engine. If left unspecified, it defaults to 'best', for minification, or 'js-beautify' for beautification. For a list of available engines, see Engine section below.
* `-l I` or `--level I` — Specify a minification level (does not apply to beautification). Generally, there are three levels available:
    * `0` — Strips whitespace, leaves code intact (depending on engine)
    * `1` — Simple optimizations. Changes code slightly without deep optimization. Probably what you'll want for most code.
    * `2` — Advanced optimizations.
* `-o` or `--output` — Write data to a specific file instead of outputting to `STDOUT`.

The concept here is for use within larger projects. You can easily integrate this into your workflow using:

    minifyjs -m mycode.js > mycode.min.js

This will create a file called mycode.min.js containing the smallest minified version available (see `best` engine explanation below).

Or, with a specific engine:

    minifyjs -m -e uglify mycode.js

Or, beautify with a specific engine:

    minifyjs -b -e js-beautify mycode.js

## Engines

### Minification engines
Currently, minifyjs only supports two engines for minification:

* `uglify` — Mihai Bazon's amazing [UglifyJS2](https://github.com/mishoo/UglifyJS2).
* `gcc` — [Google Closure Compiler](http://code.google.com/closure/compiler/) via Tim Smart's [`node-closure`](https://github.com/Tim-Smart/node-closure). See their [API Reference](http://code.google.com/closure/compiler/docs/api-ref.html) for details.
* `yui` — YUI Compressor. This is currently done through Tim Smart's [`node-yui-compressor`](https://github.com/Tim-Smart/node-yui-compressor) module. Currently, minification levels are ignored.
* `best` — Custom engine which calls all other engines and compares their output. It finds the smallest (most minified) code, and returns it.

### Beautification engines
* `uglify` — Mihai Bazon's amazing [UglifyJS2](https://github.com/mishoo/UglifyJS2).
* `js-beautify` — Einar Lielmanis' [js-beautify](https://github.com/einars/js-beautify).

## API

If you'd like to use minifyjs programmatically, you can do so by using `require('minifyjs')`. Currently, the API looks like this:

    mjs = require('minifyjs');
    
    //Minify some code
    mjs.minify(code, options, callback);
    
    //Beautify some code
    mjs.beautify(code, options, callback);

Where

* `code` is a [`stream.Readable`](http://nodejs.org/docs/latest/api/stream.html#stream_class_stream_readable) containing the code to be processed.
* `options` is a key/value hash. Options include: `engine` (the engine
  to use), `level` (Level of minification. The lower, the less minified).
* `callback` is a `Function` to be called once the code is returned from the engine. It's passed back in the format `callback(error, code);`

Node that a callback is required because some methods (read: gcc) require asynchronous calls. In order to support this sort of engine, all code comes from callbacks. A good example may be:

    var myCode = "...codehere...";
    function presentCode(error, code) {
        if (error) {
            throw error;
        }
        //Present the code to the user...
    }
    require('minifyjs').minify(myCode, { engine: 'yui' }, presentCode);

## Conclusion

Enjoy! Please fork, push and file issues as desired. Feel free to
contribute!
