#!/bin/bash -eu

if [ $# -lt 1 ]
then
    printf "Usage: %s [dev or prod]\n" $(basename $0) >&2
    exit 1
fi

DEST=$1

NPM_VERSION=$(awk -F\" '/"version":/ { print $4 }' package.json)
COMMAND="build"

if [[ $DEST == prod ]]; then
    COMMAND="build"
fi

npm install
npm run $COMMAND

echo Building UI containers for version $NPM_VERSION

# image name from old gradle script
: ${IMAGE_NAME:="com.flowmsp/ui-server"}

# for now, follow established naming pattern
UNDIFFERENTIATED_TAG=$NPM_VERSION

# dev and prod will have different builds (eventually)
DEV_TAG=$NPM_VERSION-dev
PROD_TAG=$NPM_VERSION-prod

# dev
# always build locally
echo Building docker image ${IMAGE_NAME}:${DEV_TAG}
docker build .\
       --tag ${IMAGE_NAME}:${DEV_TAG} \
       --tag ${IMAGE_NAME}:latest \
       --build-arg UI_VERSION=$NPM_VERSION

# create repository if it doesn't exist                                                                    
aws ecr describe-repositories --repository-name $IMAGE_NAME > /dev/null || \
    aws ecr create-repository --repository-name $IMAGE_NAME

: ${URL:=$(aws ecr describe-repositories \
               --repository-name $IMAGE_NAME \
               --query "repositories[].repositoryUri" \
               --output text)}

echo URL=$URL

if [[ $DEST == dev ]]; then
    # necessary in order to push images to ECR                                                             
    $(aws ecr get-login --no-include-email)

    # retag and push to registry as 'latest'                                                               
    docker tag ${IMAGE_NAME}:${DEV_TAG} ${URL}:latest

    # retag as current version                                                                             
    docker tag ${IMAGE_NAME}:${DEV_TAG} ${URL}:${UNDIFFERENTIATED_TAG}
    docker tag ${IMAGE_NAME}:${DEV_TAG} ${URL}:latest

    # push retags to registry
    docker push ${URL}:${UNDIFFERENTIATED_TAG}
    docker push ${URL}:latest
fi
