.PHONY: build test

build:
	tsc --outDir lib/ src/tss.ts --module commonjs

test:
	echo "ok to test"
