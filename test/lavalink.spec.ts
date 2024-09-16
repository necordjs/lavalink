import { Injectable, Logger } from '@nestjs/common';
import { createApplication } from './utils.spec';
import { LavalinkNodeManagerContextOf, OnceLavalinkNode } from '../src';

@Injectable()
export class LavalinkSpec {
	private readonly logger = new Logger();

	@OnceLavalinkNode('connect')
	public onReady([node]: LavalinkNodeManagerContextOf<'connect'>) {
		this.logger.log(`Node: ${node.options.id} Created/Connected`);
	}
}

createApplication(LavalinkSpec);
