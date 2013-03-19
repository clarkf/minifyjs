test:
	@./node_modules/.bin/mocha \
		--reporter spec \
		test/*.js \
		test/minifiers/*.js \
		test/beautifiers/*.js

.PHONY: test