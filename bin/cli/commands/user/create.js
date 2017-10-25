'use strict';

const Promise = require('bluebird');
const co = require('co');
const inquirer = require('inquirer');
const consoleControl = require('console-control-strings');
const Gauge = require('gauge');
const { sprintf } = require('sprintf-js');
const uuid = require('uuid/v4');
const humanpass = require('humanpass');
const AWS = require('aws-sdk');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const config = require('../../config');

AWS.config.setPromisesDependency(Promise);
AWS.config.update({ region: config.region });

const cisp = new AWS.CognitoIdentityServiceProvider();

const {
	CognitoUserPool,
	CognitoUser,
	AuthenticationDetails,
} = AmazonCognitoIdentity;

const gauge = new Gauge();

const selectPassword = () =>
	inquirer.prompt([
		{
			type: 'list',
			name: 'password',
			message: 'Select a password:',
			choices: humanpass.generatePasswords(30),
		},
	])
		.then(answers => answers.password);

const confirmCreate = () =>
	inquirer.prompt([
		{
			type: 'confirm',
			name: 'confirm',
			message: 'Create new user?',
			default: false,
		},
	])
		.then(answers => answers.confirm);

const createCognitoUser = (userData) => {
	const params = {
		MessageAction: 'SUPPRESS',
		TemporaryPassword: `${userData.password}_`,
		UserAttributes: [
			{
				Name: 'email',
				Value: userData.email,
			},
			{
				Name: 'email_verified',
				Value: 'true',
			},
			{
				Name: 'phone_number',
				Value: userData.phone_number,
			},
			{
				Name: 'phone_number_verified',
				Value: 'true',
			},
			{
				Name: 'preferred_username',
				Value: userData.preferred_username,
			},
		],
		Username: userData.username,
		UserPoolId: config.userPoolId,
	};

	gauge.show('Creating Cognito user', 0.0);
	gauge.pulse();

	return cisp.adminCreateUser(params)
		.promise();
};

const confirmCognitoUser = (userData) => {
	const userPool = new CognitoUserPool({
		UserPoolId: config.userPoolId,
		ClientId: config.userPoolClientWeb,
	});

	const user = new CognitoUser({
		Username: userData.username,
		Pool: userPool,
	});

	const authDetails = new AuthenticationDetails({
		Username: userData.username,
		Password: `${userData.password}_`,
	});

	gauge.show('Confirming Cognito user', 0.5);

	return new Promise((resolve, reject) => {
		user.authenticateUser(authDetails, {
			onSuccess: () => {
				gauge.show('Confirmed Cognito user', 1.0);
				gauge.pulse();
				resolve();
			},
			onFailure: (error) => {
				gauge.hide();
				console.error('Failed to authenticate:');
				console.error(error);
				reject(error);
			},
			newPasswordRequired: function (userAttributes) {
				delete userAttributes.email_verified;
				delete userAttributes.phone_number_verified;
				userAttributes.name = userData.name;
				gauge.show('Completing password challenge', 0.75);
				gauge.pulse();
				user.completeNewPasswordChallenge(userData.password, userAttributes, this);
			},
		});
	});
};

const handleUserCreate = co.wrap(function* (argv) {
	const username = uuid();
	const password = yield selectPassword();

	const userData = {
		username,
		password,
		name: argv.name,
		preferred_username: argv.preferredUsername,
		email: argv.email,
		phone_number: argv.phone,
	};

	let preConfirm = '\n'
		+ consoleControl.color('brightYellow', 'bold')
		+ 'Creating new Cognito user in pool '
		+ consoleControl.color('brightWhite', 'bold')
		+ config.userPoolName
		+ consoleControl.color('brightWhite', 'stopBold')
		+ ` (${config.userPoolId})`
		+ consoleControl.color('brightYellow', 'bold')
		+ ':'
		+ consoleControl.color('reset')
		+ '\n\n';

	Object.keys(userData).forEach((key) => {
		preConfirm += sprintf(
			'%s%20s%s: %s%s%s\n',
			consoleControl.color('brightWhite'),
			key,
			consoleControl.color('reset'),
			consoleControl.color('brightCyan'),
			userData[key],
			consoleControl.color('reset')
		);
	});

	console.log(preConfirm);

	if (!(yield confirmCreate())) {
		console.log('Not creating user');
		return;
	}

	yield createCognitoUser(userData);
	yield confirmCognitoUser(userData);

	gauge.hide();
	console.log(consoleControl.color('brightGreen')
		+ 'Successfully created new user'
		+ consoleControl.color('reset'));
});

module.exports = {
	command: 'create',
	describe: 'Create a new user',
	builder: (yargs) => {
		yargs.option('u', {
			alias: 'preferred-username',
			describe: 'preferred username',
			demandOption: 'Please provide preferred username, e.g.: -u joe',
			type: 'string',
			coerce: (arg) => {
				if (!arg.match(/^\w*$/)) {
					throw new Error(`Username '${arg}' contains non-word characters`);
				}
				if (arg === '') {
					throw new Error('Please provide a non-empty preferred username');
				}
				return arg;
			},
		})
			.option('n', {
				alias: 'name',
				describe: 'name',
				demandOption: "Please provide user's real name, e.g.,: -n 'Joe Jackson'",
				type: 'string',
				coerce: (arg) => {
					if (arg === '') {
						throw new Error('Please provide a non-empty name');
					}
					return arg;
				},
			})
			.option('p', {
				alias: 'phone',
				describe: 'phone number',
				demandOption: 'Please provide phone number, e.g.: -p 4045551234',
				type: 'string',
				coerce: (arg) => {
					const matches = arg.match(/^(\+1)?\d{10}$/);
					if (!matches) {
						throw new Error(`Phone number '${arg}' does not match pattern /^(\\+1)?\\d{10}$/`);
					}
					if (!matches[1]) {
						arg = `+1${arg}`;
					}
					return arg;
				},
			})
			.option('e', {
				alias: 'email',
				describe: 'email address',
				demandOption: 'Please provide email address, e.g.: -e foo@bar.com',
				type: 'string',
				coerce: (arg) => {
					if (!arg.match(/^[^@]+@[^@]+$/)) {
						throw new Error(`Invalid email address '${arg}'`);
					}
					return arg;
				},
			})
			.help()
			.strict()
			.check((argv) => {
				if (argv._.length > 2) {
					throw new Error(`Unrecognized command: ${argv._[2]}`);
				}
				return true;
			});
	},
	handler: handleUserCreate,
};

