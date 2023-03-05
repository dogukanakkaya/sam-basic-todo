.PHONY: build delete deploy start-api test

build:
	sam build
delete:
	sam delete
deploy:
	make build && sam deploy -g
start-api:
	make build && sam local start-api --env-vars todo/env.json
test:
	cd todo && npm run test && cd ..