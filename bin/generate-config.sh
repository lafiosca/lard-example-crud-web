#!/bin/bash

# "set -e" makes it so if any step fails, the script aborts:
set -e

cd "${BASH_SOURCE%/*}"
source ./definitions.sh

AwsRegion=`aws configure get region`
ApiId=`aws cloudformation describe-stacks --stack-name $ApiStack | jq -r '.Stacks[0].Outputs[] | select(.OutputKey == "ApiId") | .OutputValue'`
UserPoolId=`aws cloudformation describe-stacks --stack-name $CognitoStack | jq -r '.Stacks[0].Outputs[] | select(.OutputKey == "UserPoolId") | .OutputValue'`
UserPoolClientWeb=`aws cloudformation describe-stacks --stack-name $CognitoStack | jq -r '.Stacks[0].Outputs[] | select(.OutputKey == "UserPoolClientWeb") | .OutputValue'`

cat ../src/config/config.ts.template | sed -e "s/%AwsRegion%/$AwsRegion/g" | sed -e "s/%ApiId%/$ApiId/g" | sed -e "s/%UserPoolId%/$UserPoolId/g" | sed -e "s/%UserPoolClientWeb%/$UserPoolClientWeb/g" > ../src/config/config.ts

