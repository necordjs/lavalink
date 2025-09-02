import { Test, TestingModule } from '@nestjs/testing';
import { NodeManager, LavalinkManager } from 'lavalink-client';
import { LavalinkNodeManagerProvider } from '../../src/providers/lavalink-node-manager.provider';

describe('LavalinkNodeManagerProvider', () => {
	let moduleRef: TestingModule;

	afterEach(async () => {
		if (moduleRef) {
			await moduleRef.close();
		}
	});

	it('should return nodeManager from LavalinkManager', async () => {
		const mockNodeManager = { connect: jest.fn() };
		const mockLavalinkManager = {
			nodeManager: mockNodeManager
		} as unknown as LavalinkManager;

		moduleRef = await Test.createTestingModule({
			providers: [
				LavalinkNodeManagerProvider,
				{ provide: LavalinkManager, useValue: mockLavalinkManager }
			]
		}).compile();

		const nodeManager = moduleRef.get<NodeManager>(NodeManager);
		expect(nodeManager).toBe(mockNodeManager);
	});

	it('should handle LavalinkManager with null nodeManager', async () => {
		const mockLavalinkManager = {
			nodeManager: null
		} as unknown as LavalinkManager;

		moduleRef = await Test.createTestingModule({
			providers: [
				LavalinkNodeManagerProvider,
				{ provide: LavalinkManager, useValue: mockLavalinkManager }
			]
		}).compile();

		const nodeManager = moduleRef.get<NodeManager>(NodeManager);
		expect(nodeManager).toBeNull();
	});

	it('should handle LavalinkManager with undefined nodeManager', async () => {
		const mockLavalinkManager = {
			nodeManager: undefined
		} as unknown as LavalinkManager;

		moduleRef = await Test.createTestingModule({
			providers: [
				LavalinkNodeManagerProvider,
				{ provide: LavalinkManager, useValue: mockLavalinkManager }
			]
		}).compile();

		const nodeManager = moduleRef.get<NodeManager>(NodeManager);
		expect(nodeManager).toBeUndefined();
	});
});
