# minifyjs — A node minifier

<https://github.com/clarkf/minifyjs>


`minifyjs` is a Javascript code minifier written for node. It's aim is flexibility, offering you a wide array of engines to choose from.

## Installation


Minifyjs is a npm package. You should be able to install it using

    npm install minifyjs


## Use


You can use minifyjs from the command line.

    minifyjs [arguments] myfile.js

Possible arguments

* `-b` or `--beautify` — Beautify code. The opposite of minifying code. Currently, minifyjs uses [UglifyJS](https://github.com/mishoo/UglifyJS)'s beautification service, which, unfortunately, strips all comments.
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
* `best` — Custom engine which calls all other engines and compares their output. It finds the smallest (most minified) code, and returns it.

### Beautification engines
* `uglify` — Mihai Bazon's amazing [UglifyJS](https://github.com/mishoo/UglifyJS).
* `js-beautify` — <https://github.com/einars/js-beautify>

## API
If you'd like to use minifyjs programmatically, you can do so by using `require('minifyjs')`. Currently, the API looks like this, but I'd like to make it prettier soon:

    mjs = require('minifyjs');
    
    //Minify some code
    mjs.minify(code, callback, engine, level, log);
    
    //Beautify some code
    mjs.beautify(code, callback, engine, level, log)

Where

* `mode` is a `String` containing the mode (either `beautify` or `minify`)
* `code` is a `String` containing the code to be processed.
* `callback` is a `Function` to be called once the code is returned from the engine. It's passed back in the format `callback(code);`
* `engine` *optional* is a `String` containing the desired engine (currently `gcc` or `uglify`). Defaults to `best`.
* `level` *optional* is an `Integer` containing the compilation level. Defaults to 3 (most optimized).
* `log` is a `function` for logging. If left unspecified, warnings are hidden. Calls back in format `log(logMsg);`

Node that a callback is required because some methods (read: gcc) require asynchronous calls. In order to support this sort of engine, all code comes from callbacks. A good example may be

    var myCode = "...codehere...";
    require('minifyjs').minify(myCode, function (code) {
    	//Minified code exists in code.
    	
    	//Push all code to stdout
    	console.log(code);
    }, 'gcc', 3, function (msg) {
    	//Push all log messages to stderr.
    	process.error(msg);
    });

## Conclusion

Enjoy! Please fork, push and file issues as desired.