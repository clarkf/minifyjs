var ujs = require('uglify');

//Minifier core
function minify(mode, code, cb, engine, level, warning) {
	if ( mode === 'minify') {
		//Decide on an engine
		engine = engine || 'best';
		//Decide on a level
		level = ( typeof(level) == 'number' ) ? level : 3;
		
		//If our engine doesn't exist, show an error!
		if ( typeof(engines[engine]) !== 'function' ) {
			throw new Error("Couldn't locate engine "+engine);
		}
		
		//Call the engine
		engines[engine](code,level,function (errors) {
			throw new Error(errors.join('\n'));
		}, function (warnings) {
			//Warning handler, if we get a warning, and the warning handler was passed, call it.
			if ( warning )
				warning(warnings);
		}, function (code) {
			//Write code to stdout!
			cb(code);
		});
	} else if ( mode === 'beautify') {
		var uglify = require("uglify");
		var ast = uglify.parser.parse(code);
		show_code(uglify.uglify.gen_code(ast,true));
	} else {
		throw new TypeError("Don't understand mode: "+mode);
	}
}

var engines = {
	best: function (code,level,err,warning,compiledCode) {
		var codes = {};
		var starts = {};
		function get_code(cCode,method) {
			var time = (((new Date()).getTime() - starts[method])/1000).toPrecision(3);
			var size = ((cCode.length / code.length) * 100).toPrecision(2);
			//show_error("Code back from "+method+" in "+time+'s: '+size+"%");
			codes[method] = cCode;
			for ( var e in engines ) {
				if ( !codes[e] && e != 'best' ) {
					return false;
				}
			}
			var smallest = 'uglify';
			for ( var e in codes ) {
				if ( codes[smallest].length > codes[e].length ) {
					smallest = e;
				}
			}
			//show_error('best code from '+smallest);
			return compiledCode(codes[e]);
		}
		for ( e in engines ) {
			if ( e == 'best' ) continue;
			starts[e] = (new Date()).getTime();
			engines[e](code,level,err,warning,function (code,engine) {
				get_code(code,engine);
			});
		}
	},
	gcc: function (code,level,err,warning,compiledCode) {
		var compilation_level = "WHITESPACE_ONLY";
		if ( level == 1 )
			compilation_level = "SIMPLE_OPTIMIZATIONS";
		if ( level >= 2 )
			compilation_level = "ADVANCED_OPTIMIZATIONS";
		var url = require('url').parse("http://closure-compiler.appspot.com/compile");
		var data = require('querystring').stringify({
			'js_code': 				code,
			'compilation_level': 	compilation_level,
			'output_format': 		'json',
			'output_info': 			'errors'
		})+'&output_info=warnings&output_info=statistics&output_info=compiled_code';
		var request = require('http').createClient(80, url.host).request('POST', url.pathname,
			{
				host: 					url.host,
				'Content-Length':		data.length,
				'Content-Type':			'application/x-www-form-urlencoded;charset=UTF-8',
				'Accept-Charset':		'utf-8;q=0.7,*;q=0.3'
			});
		request.write(data,'utf8');
		request.end();
		
		var jsondata = "";
		request.on('response', function (response) {
			response.setEncoding('utf8');
			response.on('data', function (chunk) {
				jsondata += chunk;
			});
			response.on('end', function() {
				var obj = JSON.parse(jsondata);
				if ( obj.errors ) {
					var ret = [], i, error;
					for ( i = 0; error = obj.errors[i]; i++ ) {
						ret.push("GCC ERROR: "+error.type+": "+error.lineno+'@'+error.charno+": "+error.error);
					}
					return err(ret);
				}
				if ( obj.warnings ) {
					var ret = [], i, w;
					for ( i = 0; w = obj.warnings[i]; i++ ) {
						ret.push(w.type+": "+w.lineno+'@'+w.charno+": "+w.warning);
					}
					warning(ret);
				}
				return compiledCode(obj.compiledCode,'gcc');
			});
		});
	},
	uglify: function (code,level,err,warning,compiledCode) {
		var uglify = require("uglify");
		
		
		
		var ast = uglify.parser.parse(code);
		if ( level > 0 )
			ast = uglify.uglify.ast_mangle(ast,true);
		if ( level > 1 )
			ast = uglify.uglify.ast_squeeze(ast);
		
		compiledCode(uglify.uglify.gen_code(ast),'uglify');
	}
};

exports.minify = minify;
exports.engines = engines;