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

2. Run `npm i` to install the required node modules.

3. Edit `bin/definitions.sh` as appropriate, only if you changed the default stack names in lard-example-crud-api.

4. Run `bin/generate-configs.sh` to create a couple of config files referencing your development stack.

5. Run `bin/generate-sdk.sh` to generate the library code for accessing your development API.

6. Run `bin/manage-user-pool.sh` with the appropriate option values to establish a user for yourself in your development Cognito User Pool:

    `bin/manage-user-pool.sh user create -u yourusername -n 'Your Name' -p +14045551234 -e 'your@email.address'`

    This command will prompt you to choose one from a list of generated passwords, and it will present you with a confirmation dialog before taking action. Record your username and password for use in the web application.

7. Run `ng serve` to start the local web application, pointing at your development stacks.

8. Open [http://localhost:4200/](http://localhost:4200/) in your web browser.

9. Log into the web application using the username and password from step 6 above.

10. Create, retrieve, update, and delete some notes using your new serverless API deployment.

## Cleanup

When you are done, hit control-c in the terminal where your `ng serve` command is running. You can delete the lard-example-crud-web project directory, but the API and related resources will still exist in your AWS account. Follow the cleanup directions in [lard-example-crud-api](https://github.com/lafiosca/lard-example-crud-api) when you are ready to remove them.
