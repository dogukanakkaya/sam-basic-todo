.PHONY: build delete deploy start-api

build:
	sam build
delete:
	sam delete
deploy:
	make build && sam deploy -g
start-api:
	make build && sam local start-api --env-vars todo/env.json
invoke:
	sam local invoke