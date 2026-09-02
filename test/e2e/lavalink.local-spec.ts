import { Injectable, Logger } from '@nestjs/common';

import { NodeManagerContextOf, OnceNodeManager } from '../../src/index.js';
import { createApplication } from './utils.local-spec.js';

@Injectable()
export class LavalinkLocalSpec {
	private readonly logger = new Logger();

	@OnceNodeManager('connect')
	public onReady([node]: NodeManagerContextOf<'connect'>) {
		this.logger.log(`Node: ${node.options.id} Created/Connected`);
	}
}

void createApplication(LavalinkLocalSpec);
