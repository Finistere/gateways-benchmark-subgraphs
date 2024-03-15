#!/usr/bin/env bash

set -euxo pipefail

export APOLLO_GRAPH_REF="$1"

: ${APOLLO_KEY:?"missing apollo key"}

function rover-introspect {
    rover subgraph introspect "$2" | \
        rover subgraph publish -c "$APOLLO_GRAPH_REF" \
        --name "$1" \
        --schema - \
        --routing-url "$2"
}

rover-introspect accounts http://ec2-15-188-3-135.eu-west-3.compute.amazonaws.com:4001/graphql
rover-introspect products http://ec2-15-188-3-135.eu-west-3.compute.amazonaws.com:4003/graphql
rover-introspect inventory http://ec2-15-188-3-135.eu-west-3.compute.amazonaws.com:4002/graphql
rover-introspect reviews http://ec2-15-188-3-135.eu-west-3.compute.amazonaws.com:4004/graphql

