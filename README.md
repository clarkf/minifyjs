# minifyjs — A node minifier

<https://github.com/clarkf/minifyjs>
`minifyjs` is a Javascript code minifier written for node. It's aim is flexibility, offering you a wide array of engines to choose from.

## Installation


Minifyjs is a npm package. You should be able to install it using

    npm install minifyjs


## Use


You can use minifyjs from the command line.

    minifyjs myfile.js [arguments]

Possible arguments

* `-b` or `--beautify` — Beautify code. The opposite of minifying code. Currently, minifyjs uses [UglifyJS](https://github.com/mishoo/UglifyJS)'s beautification service, which, unfortunately, strips all comments.
* `-m` or `--minify` — Minify code. This is the default mode of minifyjs, so you don't necessarily need to specify this. Available options for the minification engine
    * `-e` or `--engine E` — Specify a minification engine. If left unspecified, it defaults to 'best', which calls all engines, and returns the most highly optimized code. For a list of available engines, see Engine section below.
    * `-l I` or `--level I` — Specify a minification level. This is passed to the minification level. Generally, there are three levels available:
        * `0` — Strips whitespace, leaves code intact (depending on engine)
        * `1` — Simple optimizations. Changes code minorly without deep optimization. Probably what you'll want for most code.
        * `2` — Advanced optimizations.
* `-v` or `--verbose` — Verbose output. Currently, the minification engine only uses this. If any engine returns a warning (some do, some don't) and verbosity is enabled, it will write the warnings to STDERR.

## Engines

### Minification engines
Currently, minifyjs only supports two engines for minification:

* `uglify` — Mihai Bazon's amazing [UglifyJS](https://github.com/mishoo/UglifyJS).
* `gcc` — [Google Closure Compiler](http://code.google.com/closure/compiler/). Note that this script leverages the API, so the code is not processed on your computer. See their [API Reference](http://code.google.com/closure/compiler/docs/api-ref.html) for details.
* `best` — Custom engine which calls all other engines and compares their output. It finds the smallest (most minified) code, and returns it.

### Beautification engines
Currently, minifyjs only works with UglifyJS's beautification engine. If you specify an engine (using `-e` or `--engine`) when requesting beautification (`-b` or `--beautify`), it won't do anything.

## API
If you'd like to use minifyjs programattically, you can do so by using `require('minifyjs')`. Currently, the API looks like this, but I'd like to make it prettier soon:

    mjs = require('minifyjs');
    mjs.minify.minify(mode, code, callback, engine, level, warning);

Where

* `mode` is a `String` containing the mode (either `beautify` or `minify`)
* `code` is a `String` containing the code to be processed.
* `callback` is a `Function` to be called once the code is returned from the engine. It's passed back in the format `callback(code);`
* `engine` *optional* is a `String` containing the desired engine (currently `gcc` or `uglify`). Defaults to `best`.
* `level` *optional* is an `Integer` containing the compilation level. Defaults to 3 (most optimized).
* `warning` is a `function` to be called with a list of warnings. If left unspecified, warnings are hidden. Calls back in format `warning([warningString1,warningString2]);`

## Conclusion

Enjoy! Please fork, push and file issues as desired.