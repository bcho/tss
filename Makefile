.PHONY: build build-test test clean

build:
	tsc --outDir lib/ src/tss.ts --module commonjs

build-test:
	tsc src/test/*.ts --module commonjs

test: build-test
	./node_modules/mocha/bin/mocha src/test --reporter=dot

clean:
	rm src/test/*.js
