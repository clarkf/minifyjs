exports.minify_engines = {
	best: function (code,level,err,log,compiledCode) {
		var codes = {};
		var starts = {};
		function get_code(list,cCode,method) {
			var time = (((new Date()).getTime() - starts[method])/1000).toPrecision(3);
			var size = ((cCode.length / code.length) * 100).toPrecision(2);
			log("Code back from "+method+" in "+time+'s: '+size+"%");
			codes[method] = cCode;
			for ( var e in list ) {
				if ( !codes[e] && e != 'best' )
					return false
			}
			var smallest = 'uglify';
			for ( var e in codes ) {
				if ( codes[smallest].length > codes[e].length ) {
					smallest = e;
				}
			}
			log('smallest code from '+smallest);
			return compiledCode(codes[smallest]);
		}
		var list = this;
		for ( e in this ) {
			if ( e == 'best' ) continue;
			log("running "+e);
			starts[e] = (new Date()).getTime();
			this[e](code,level,err,function (str) {
				log(e+": "+str)
			},function (code,engine) {
				get_code(list,code,engine);
			});
		}
	},
	gcc: function (code,level,err,log,compiledCode) {
		var compilation_level = "WHITESPACE_ONLY";
		if ( level == 1 )
			compilation_level = "SIMPLE_OPTIMIZATIONS";
		if ( level >= 2 )
			compilation_level = "ADVANCED_OPTIMIZATIONS";
		log("Runing google closure compiler at compilation level "+compilation_level);
		var url = require('url').parse("http://closure-compiler.appspot.com/compile");
		var data = require('querystring').stringify({
			'js_code': 				code,
			'compilation_level': 	compilation_level,
			'output_format': 		'json',
			'output_info': 			['errors','warnings','statistics','compiled_code']
		});
		var request = require('http').createClient(80, url.host).request('POST', url.pathname,
			{
				host: 					url.host,
				'Content-Length':		data.length,
				'Content-Type':			'application/x-www-form-urlencoded;charset=UTF-8',
				'Accept-Charset':		'utf-8;'
			});
		request.write(data,'utf8');
		request.end();
		
		log('Request sent.');
		
		var jsondata = "";
		request.on('response', function (response) {
			response.setEncoding('utf8');
			response.on('data', function (chunk) {
				log("Got chunk (length="+chunk.length+")");
				jsondata += chunk;
				return;
			});
			response.on('end', function() {
				log("Datastream ended.");
				var obj = JSON.parse(jsondata);
				if ( obj.errors ) {
					var i, error;
					for ( i = 0; error = obj.errors[i]; i++ ) {
						ret.push("ERROR: "+error.type+": "+error.lineno+'@'+error.charno+": "+error.error);
					}
					return err(ret);
				}
				if ( obj.warnings ) {
					var i, w;
					for ( i = 0; w = obj.warnings[i]; i++ ) {
						log("WARNING: "+w.type+": "+w.lineno+'@'+w.charno+": "+w.warning);
					}
				}
				return compiledCode(obj.compiledCode,'gcc');
			});
		});
		return;
	},
	uglify: function (code,level,err,log,compiledCode) {
		var uglify = require("uglify");
		
		log('Running UglifyJS');
		
		var ast = uglify.parser.parse(code);
		if ( level > 0 ) {
			log("Mangling variable names");
			ast = uglify.uglify.ast_mangle(ast);
		}
		if ( level > 1 ) {
			log("Squeezing code");
			try {
				ast = uglify.uglify.ast_squeeze(ast);
			} catch (e) {
				
			}
		}
		
		compiledCode(uglify.uglify.gen_code(ast),'uglify');
	}
};