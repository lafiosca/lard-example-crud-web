'use strict';

require('yargs').commandDir('commands')
	.demandCommand(1, 'No command specified')
	.help()
	.strict()
	.recommendCommands()
	.argv;
