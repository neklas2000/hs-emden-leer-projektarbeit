#!/bin/sh

CURRENT_DIR=$(pwd)

cd frontend

SINGLE_RUN=true ng test --browsers FirefoxHeadless --no-watch --no-progress

if [ "$?" -ne "0" ]; then
	echo "Frontend Tests failed"
	exit 1
fi

echo "Frontend Tests succeeded"

cd "$CURRENT_DIR"
cd api

npm run test:pre-commit

if [ "$?" -ne "0" ]; then
	echo "API Tests failed"
	exit 1
fi

echo "API Tests succeeded"

exit 0
