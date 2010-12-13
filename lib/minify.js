var ujs = require('uglify');

var DEFAULT_MINIFY_ENGINE = 'best';
var DEFAULT_BEAUTIFY_ENGINE = 'uglify';


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
		this.run_engine(this.engines.minify,
					engine,
					code,
					level,
					log,
					cb);
};

exports.beautify = function (code, cb, engine, level, log) {
	//Decide on an engine
	engine = engine || DEFAULT_BEAUTIFY_ENGINE;
	
	//Decide on a level
	level = typeof(level) === 'number' ? level : 3;
	
	this.run_engine(this.engines.beautify,
					engine,
					code,
					level,
					log,
					cb);
}

exports.run_engine = function(list,eid,code,level,log,compiledCode) {
	//If our engine doesn't exist, show an error!
	if ( typeof(list[eid]) !== 'function' ) {
		throw new Error("Couldn't locate engine "+engine);
	}
	
	list[eid](code,level,function (errors) {
		throw new Error(errors.join('\n'));
	}, function (str) {
		log ? log(eid+": "+str) : null;
	}, compiledCode);
}