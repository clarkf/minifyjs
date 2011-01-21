# minifyjs — A node minifier

<https://github.com/clarkf/minifyjs>


`minifyjs` is a Javascript code minifier written for node. It's aim is flexibility, offering you a wide array of engines to choose from.

## Installation


minifyjs is an [npm](http://npmjs.org) package. You should be able to install it using

    npm install minifyjs

This will install the current stable version. To install the latest development version, clone this repository and install it.

    git clone git://github.com/clarkf/minifyjs.git
    cd minifyjs
    npm install

Congratulations! You're half way to the minified files of your dreams.

## Use

You can use minifyjs from the command line.

    minifyjs [arguments] myfile.js

Possible arguments

* `-b` or `--beautify` — Beautify code. The opposite of minifying code.
* `-m` or `--minify` — Minify code. This is the default mode of minifyjs, so you don't necessarily need to specify this. Available options for the minification engine
    * `-e` or `--engine E` — Specify a minification engine. If left unspecified, it defaults to 'best', which calls all engines, and returns the most highly optimized code. For a list of available engines, see Engine section below.
    * `-l I` or `--level I` — Specify a minification level. This is passed to the minification level. Generally, there are three levels available:
        * `0` — Strips whitespace, leaves code intact (depending on engine)
        * `1` — Simple optimizations. Changes code slightly without deep optimization. Probably what you'll want for most code.
        * `2` — Advanced optimizations.
* `-v` or `--verbose` — Verbose output. Currently, the minification engine only uses this. If any engine returns a warning (some do, some don't) and verbosity is enabled, it will write the warnings to STDERR.
* `-o` or `--output` — Write data to a specific file instead of outputting.

The concept here is for use within larger projects. You can easily commit your project using:

    minifyjs mycode.js > mycode.min.js

This will create a file called mycode.min.js containing the smallest minified version available (see `best` engine explanation below).

Or, with a specific engine:

    minifyjs -e uglify mycode.js

Or, beautify with a specific engine and verbosity:

    minifyjs -b -v -e js-beautify mycode.js

## Engines

### Minification engines
Currently, minifyjs only supports two engines for minification:

* `uglify` — Mihai Bazon's amazing [UglifyJS](https://github.com/mishoo/UglifyJS).
* `gcc` — [Google Closure Compiler](http://code.google.com/closure/compiler/). Note that this script leverages the API, so the code is not processed on your computer. See their [API Reference](http://code.google.com/closure/compiler/docs/api-ref.html) for details.
* `yui` — YUI Compressor. This is currently done through Tim Smart's `node-yui-compressor` module. Currently, minification levels are ignored.
* `best` — Custom engine which calls all other engines and compares their output. It finds the smallest (most minified) code, and returns it.

### Beautification engines
* `uglify` — Mihai Bazon's amazing [UglifyJS](https://github.com/mishoo/UglifyJS).
* `js-beautify` — Einar Lielmanis' [js-beautify](https://github.com/einars/js-beautify).

## API

_Note that the API has changed a bit since 0.0.5_

If you'd like to use minifyjs programmatically, you can do so by using `require('minifyjs')`. Currently, the API looks like this:

    mjs = require('minifyjs');
    
    //Minify some code
    mjs.minify(code, options, callback);
    
    //Beautify some code
    mjs.beautify(code, options, callback);

Where

* `code` is a `String` containing the code to be processed.
* `options` is a key/value hash. Options include: `engine` (the engine
  to use), `level` (Level of minification. The lower, the less minified.), and `log` (A `Function` for outputting all debug information. I generally use `require('sys').debug`).
* `callback` is a `Function` to be called once the code is returned from the engine. It's passed back in the format `callback(error, code);`

Node that a callback is required because some methods (read: gcc) require asynchronous calls. In order to support this sort of engine, all code comes from callbacks. A good example may be

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
