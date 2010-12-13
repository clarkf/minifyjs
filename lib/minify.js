var ujs = require('uglify');

var DEFAULT_MINIFY_ENGINE = 'best';
var DEFAULT_BEAUTIFY_ENGINE = 'js-beautify';


//Minifier core
exports.engines = {
	'minify': 	require('minifyjs/minify_engines').minify_engines,
	'beautify': require('minifyjs/beautify_engines').beautify_engines
};

exports.minify = function (code, cb, engine, level, log) {
	//Decide on an engine
	engine = engine || DEFAULT_MINIFY_ENGINE;
	//Decide on a level
	level = ( typeof(level) === 'number' ) ? level : 3;
	
	//Call the engine
	return this.run_engine(this.engines.minify,
					engine,
					code,
					cb,
					level,
					log);
};

exports.beautify = function (code, cb, engine, level, log) {
	//Decide on an engine
	engine = engine || DEFAULT_BEAUTIFY_ENGINE;
	
	//Decide on a level
	level = typeof(level) === 'number' ? level : 3;
	
	return this.run_engine(this.engines.beautify,
					engine,
					code,
					cb,
					level,
					log);
}

exports.run_engine = function(list,eid,code,compiledCode,level,log) {
	//If our engine doesn't exist, show an error!
	if ( typeof(list[eid]) !== 'function' ) {
		throw new Error("Couldn't locate engine "+engine);
		return;
	}
	
	//Check to make sure the callback is valid
	if ( typeof(compiledCode) !== 'function' ) {
		compiledCode = function () {};
	}
	
	return list[eid](code,level,function (errors) {
		throw new Error(errors.join('\n'));
	}, function (str) {
		log ? log(eid+": "+str) : null;
	}, compiledCode);
}