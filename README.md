# lard-example-crud-web

An example project demonstrating a web application that interacts with a serverless REST API deployment using [Lard](https://github.com/lafiosca/lard). This is the companion project to [lard-example-crud-api](https://github.com/lafiosca/lard-example-crud-api).

## Pre-Installation

* API preparation
  1. Follow all the directions in the [lard-example-crud-api](https://github.com/lafiosca/lard-example-crud-api) README.

* Angular preparation
  1. Install Angular CLI globally: `npm i -g @angular/cli`

## Installation

1. Clone this repository and enter its directory:

    `git clone https://github.com/lafiosca/lard-example-crud-web.git && cd lard-example-crud-web`

2. Edit `bin/definitions.sh` as appropriate, only if you changed the default stack names in lard-example-crud-api

3. Run `bin/generate-configs.sh` to create a couple of config files referencing your development stack

4. Run `bin/generate-sdk.sh` to generate the library code for accessing your development API

5. Run `bin/manage-user-pool.sh` with the appropriate option values to establish a user for yourself in your development Cognito User Pool:

    `bin/manage-user-pool.sh user create -u yourusername -n 'Your Name' -p +14045551234 -e 'your@email.address'`

    This command will automatically prompt you to choose a generated password, and it will present you with a confirmation dialog before taking action. Record the username and password for use in the web application.

6. Run `ng serve` to start the local web application, pointing at your development stacks.

7. Open [http://localhost:4200/](http://localhost:4200/) in your web browser.

8. Log into the web application using the username and password from step 5 above.

9. Create, retrieve, update, and delete some notes using your new serverless API deployment.

