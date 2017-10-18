#!/bin/bash

# "set -e" makes it so if any step fails, the script aborts:
set -e

cd "${BASH_SOURCE%/*}"
source ./definitions.sh

ApiId=`aws cloudformation describe-stacks --stack-name $ApiStack | jq -r '.Stacks[0].Outputs[] | select(.OutputKey == "ApiId") | .OutputValue'`

SwaggerFile=/tmp/${ApiName}.json
SdkDir=../src/app/services/${ApiName}-sdk

rm -rf ${SdkDir}/*
aws apigateway get-export --rest-api-id ${ApiId} --stage-name Api --export-type swagger ${SwaggerFile}
swagger-codegen generate -i ${SwaggerFile} -l typescript-angular2 -o ${SdkDir}
rm -f ${SwaggerFile}

