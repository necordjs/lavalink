import { Injectable, Logger } from '@nestjs/common';
import { createApplication } from './utils.local-spec';
import { NodeManagerContextOf, OnceNodeManager } from '../src';

@Injectable()
export class LavalinkLocalSpec {
	private readonly logger = new Logger();

	@OnceNodeManager('connect')
	public onReady([node]: NodeManagerContextOf<'connect'>) {
		this.logger.log(`Node: ${node.options.id} Created/Connected`);
	}
}

createApplication(LavalinkLocalSpec);
