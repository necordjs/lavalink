import { NodeManager, LavalinkManager } from 'lavalink-client';
import { Test, TestingModule } from '@nestjs/testing';

import { LavalinkNodeManagerProvider } from '../../src/providers/lavalink-node-manager.provider.js';
import { LAVALINK_MANAGER, LAVALINK_NODE_MANAGER } from '../../src/constants/index.js';

describe('LavalinkNodeManagerProvider', () => {
	let moduleRef: TestingModule;

	afterEach(async () => {
		if (moduleRef) {
			await moduleRef.close();
		}
	});

	it('should return nodeManager from LavalinkManager', async () => {
		const mockNodeManager = { connect: vi.fn<(...args: any[]) => any>() };
		const mockLavalinkManager = {
			nodeManager: mockNodeManager
		} as unknown as LavalinkManager;

		moduleRef = await Test.createTestingModule({
			providers: [
				LavalinkNodeManagerProvider,
				{ provide: LAVALINK_MANAGER, useValue: mockLavalinkManager }
			]
		}).compile();

		const nodeManager = moduleRef.get<NodeManager>(LAVALINK_NODE_MANAGER);
		expect(nodeManager).toBe(mockNodeManager);
	});

	it('should handle LavalinkManager with null nodeManager', async () => {
		const mockLavalinkManager = {
			nodeManager: null
		} as unknown as LavalinkManager;

		moduleRef = await Test.createTestingModule({
			providers: [
				LavalinkNodeManagerProvider,
				{ provide: LAVALINK_MANAGER, useValue: mockLavalinkManager }
			]
		}).compile();

		const nodeManager = moduleRef.get<NodeManager>(LAVALINK_NODE_MANAGER);
		expect(nodeManager).toBeNull();
	});

	it('should handle LavalinkManager with undefined nodeManager', async () => {
		const mockLavalinkManager = {
			nodeManager: undefined
		} as unknown as LavalinkManager;

		moduleRef = await Test.createTestingModule({
			providers: [
				LavalinkNodeManagerProvider,
				{ provide: LAVALINK_MANAGER, useValue: mockLavalinkManager }
			]
		}).compile();

		const nodeManager = moduleRef.get<NodeManager>(LAVALINK_NODE_MANAGER);
		expect(nodeManager).toBeUndefined();
	});
});
