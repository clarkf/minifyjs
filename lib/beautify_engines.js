exports.beautify_engines = {
	'uglify': function(code,level,error,log,compiledCode) {
		var uglify = require("uglify");
		log("Running UglifyJS's beautification mode.");
		
		var ast = uglify.parser.parse(code);
		log("Parsed code into AST.")
		
		compiledCode(uglify.uglify.gen_code(ast,true));
	},
	'js-beautify': function(code,level,error,log,compiledCode) {
		var jsb = require("./js-beautify").js_beautify;
		log("Running js-beautify");
		
		var ret = "";
		try {
			ret = jsb(code);
		} catch (e) {
			error([e.message]);
		}
		
		compiledCode(ret);
	}
};