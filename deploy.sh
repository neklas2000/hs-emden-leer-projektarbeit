#!/bin/bash

source .env

# Color variables
RESET_COLOR='\033[0m'
BLUE_COLOR='\033[0;34m'
GREEN_COLOR='\033[0;32m'

VALID_ARGS=$(getopt -o t:hdaf --long tag:,help,rebuild-database,no-rebuild-api,no-rebuild-frontend -- "$@")
TAG="$DEFAULT_TAG"
REBUILD_DATABASE=false
REBUILD_API=true
REBUILD_FRONTEND=true

if [[ $? -ne 0 ]]; then
  exit 1;
fi

eval set -- "$VALID_ARGS"
while [ : ]; do
  case "$1" in
    -h | --help)
      printf "${BLUE_COLOR}SCRIPT USAGE${RESET_COLOR}\n"
      printf "sh> ${GREEN_COLOR}$0 [options]${RESET_COLOR}\n\n"
      printf "${BLUE_COLOR}OPTION\t\t\t\tSUMMARY${RESET_COLOR}\n"
      printf "${GREEN_COLOR}-t | --tag\t\t\tThis option changes the tag 'latest' from the images to the provided value (e.g. $0 -t T001)${RESET_COLOR}\n\n"
      printf "${GREEN_COLOR}-d | --rebuild-database\t\tThis option activates the build of the database image${RESET_COLOR}\n\n"
      printf "${GREEN_COLOR}-a | --no-rebuild-api\t\tThis option deactivates the build of the api image${RESET_COLOR}\n\n"
      printf "${GREEN_COLOR}-f | --no-rebuild-frontend\tThis option deactivates the build of the frontend image${RESET_COLOR}\n\n"
      printf "${GREEN_COLOR}-h | --help\t\t\tThis option shows this help${RESET_COLOR}\n"
      exit 1;
      ;;
    -t | --tag)
      TAG="$2"
      shift 2
      ;;
    -d | --rebuild-database)
      REBUILD_DATABASE=true
      shift
      ;;
    -a | --no-rebuild-api)
      REBUILD_API=false
      shift
      ;;
    -f | --no-rebuild-frontend)
      REBUILD_FRONTEND=false
      shift
      ;;
    --)
      shift;
      break
      ;;
  esac
done

printf "${BLUE_COLOR}Docker Registry Login${RESET_COLOR}\n"

echo "$DOCKER_REGISTRY_PASSWORD" | docker login gitlab.technik-emden.de:5050 --username $DOCKER_REGISTRY_USERNAME --password-stdin

if [[ $REBUILD_API == true ]]; then
  printf "${BLUE_COLOR}Building API Image${RESET_COLOR}\n"
  docker build -t "gitlab.technik-emden.de:5050/studium/semester-6/projektarbeit/api:${TAG}" -f api/Dockerfile ./api

  printf "${BLUE_COLOR}Pushing API Image${RESET_COLOR}\n"
  docker push "gitlab.technik-emden.de:5050/studium/semester-6/projektarbeit/api:${TAG}"
fi

if [[ $REBUILD_FRONTEND == true ]]; then
  printf "${BLUE_COLOR}Building Frontend Image${RESET_COLOR}\n"
  docker build -t "gitlab.technik-emden.de:5050/studium/semester-6/projektarbeit/frontend:${TAG}" -f frontend/Dockerfile ./frontend

  printf "${BLUE_COLOR}Pushing Frontend Image${RESET_COLOR}\n"
  docker push "gitlab.technik-emden.de:5050/studium/semester-6/projektarbeit/frontend:${TAG}"
fi

if [[ $REBUILD_DATABASE == true ]]; then
  printf "${BLUE_COLOR}Building Database Image${RESET_COLOR}\n"
  docker build -t "gitlab.technik-emden.de:5050/studium/semester-6/projektarbeit/database:${TAG}" -f Dockerfile .

  printf "${BLUE_COLOR}Pushing Database Image${RESET_COLOR}\n"
  docker push "gitlab.technik-emden.de:5050/studium/semester-6/projektarbeit/database:${TAG}"
fi

echo $TAG
