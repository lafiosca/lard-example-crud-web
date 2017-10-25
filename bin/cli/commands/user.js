'use strict';

module.exports = {
	command: 'user',
	describe: 'User administration commands',
	builder: yargs => {
		yargs.commandDir('user')
			.demandCommand(1, 'No command specified')
			.help()
			.strict()
			.recommendCommands();
	},
	handler: () => {}
};

