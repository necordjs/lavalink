import { ConfigurableModuleBuilder } from '@nestjs/common';

import { NecordLavalinkModuleOptions } from './necord-lavalink-options.interface.js';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN: LAVALINK_MODULE_OPTIONS } =
	new ConfigurableModuleBuilder<NecordLavalinkModuleOptions>()
		.setClassMethodName('forRoot')
		.setFactoryMethodName('createNecordLavalinkOptions')
		.build();
