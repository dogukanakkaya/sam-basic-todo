.PHONY: build deploy start-api

build:
	sam build
deploy:
	sam deploy -g
start-api:
	make build && sam local start-api
invoke:
	sam local invoke