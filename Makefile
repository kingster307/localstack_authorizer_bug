SHELL := /bin/bash

APP_NAME=ls_bug_demo
AWS_REGION=us-west-2
ENV=ls_local
STACK=$(APP_NAME).$(ENV)
PULUMI_CONFIG_PASSPHRASE=test
PULUMI_BACKEND_URL=file://
ENDPOINT=http://localhost:4566
AWS_ACCESS_KEY=test
AWS_SECRET_ACCESS_KEY=test

.PHONY: all cleanup get-logs-aws run-test


# ==========
# Usage
# ==============================

# build everything && install dependencies
all: up install-iac-deps install-test-deps build-pulumi run-test
# tears down everything
cleanup: down reset-iac remove-test-deps clean-auth0-mock delete-zips

export AUTH0_AUDIENCE=test
export AUTH0_DOMAIN=http://host.docker.internal:3001

# get the localstack logs
get-logs-aws:
	docker logs localstack -f
# run the test -> will come back as pass since we dont check for return but print from within lambda should show up in logs
run-test:
	source ./venv/bin/activate; \
	cd tests; \
	pytest -s;

# ========================================================================================================================
# Raw recipes
# ==============================
up:
	docker-compose up -d;

install-iac-deps:
	cd ./iac/ && yarn install;

build-pulumi: build-lambda
	cd ./iac/; \
	export PULUMI_BACKEND_URL=$(PULUMI_BACKEND_URL); export PULUMI_CONFIG_PASSPHRASE=$(PULUMI_CONFIG_PASSPHRASE); export P_STACK=$(STACK); \
	pulumi stack init $(STACK) || pulumi stack select $(STACK); \
	pulumi config --stack $(STACK) set-all \
    		--plaintext auth0_audience=$(AUTH0_AUDIENCE) \
    		--plaintext auth0_domain=$(AUTH0_DOMAIN)  \
    		--plaintext aws_region=$(AWS_REGION) ; \
	pulumi up -y -s $(STACK); \
	pulumi stack output -s $(STACK) -j > ./../pulumi_output.json;

clean-auth0-mock:
	cd tests/auth0_mock && yarn run cleanup

down:
	docker-compose down -v; \
#	docker system prune -a --volumes -f;

reset-iac:
	rm pulumi_output.json || true; \
	rm -rf ls_volume || true; \
	cd ./iac/ && rm -rf .pulumi Pulumi.*.ls_local.yaml node_modules || true;

install-test-deps:
	python3 -m venv --clear venv
	( \
	source ./venv/bin/activate;\
	python3 -m pip install --upgrade pip;\
	pip3 install -r requierments-test.txt;\
	);

delete-zips:
	find . -type f -name '*.zip' -delete

remove-test-deps:
	rm -rf ./venv

build-lambda:
	docker build --platform=linux/amd64 --progress=plain -t auth0_authorizer_lambda auth0_authorizer_lambda/
	docker create -it --name auth0_authorizer_lambda auth0_authorizer_lambda bash
	docker cp auth0_authorizer_lambda:/usr/local/lhome/handler.zip ./auth0_authorizer_lambda/auth0_authorizer.zip
	docker rm -f auth0_authorizer_lambda
	docker image rm -f auth0_authorizer_lambda

#build-lambda:
#	cd auth0_authorizer_lambda && \
#	pip install --target ./package -r requirements.txt && \
#	cp lambda_function.py ./package/ && \
#	cd package && \
#	zip -r ../auth0_authorizer.zip * && \
#	cd .. && \
#	rm -rf package