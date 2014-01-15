TEST ?= phantom


all: build

components: component.json
	component install --dev

build: components index.js
	component build --dev

test: build
	component test $(TEST)


.PHONY: all test
