.PHONY: build delete deploy start-api

build:
	sam build
delete:
	sam delete
deploy:
	make build && sam deploy -g
start-api:
	make build && sam local start-api
invoke:
	sam local invoke