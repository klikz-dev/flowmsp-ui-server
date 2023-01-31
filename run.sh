#!/bin/bash -eu

if [ $# -lt 1 ]
then
    printf "Usage: %s [up or down]\n" $(basename $0) >&2
    exit 1
fi

DEST=$1

if [[ $DEST == down ]]; then
    COMMAND="down"
elif [[ $DEST == up ]]; then
    COMMAND="up"
else
    printf "Usage: %s [up or down]\n" $(basename $0) >&2
    exit 1
fi

$(aws ecr get-login --no-include-email)
docker compose $COMMAND