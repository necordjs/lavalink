import { ConfigurableModuleBuilder } from '@nestjs/common';
import { NecordLavalinkModuleOptions } from './necord-lavalink-options.interface';

export const {
	ConfigurableModuleClass,
	MODULE_OPTIONS_TOKEN: LAVALINK_MODULE_OPTIONS,
	OPTIONS_TYPE,
	ASYNC_OPTIONS_TYPE
} = new ConfigurableModuleBuilder<NecordLavalinkModuleOptions>()
	.setClassMethodName('forRoot')
	.setFactoryMethodName('createLibraryOptions')
	.build();
