import { ManagerUtils, LavalinkManager } from 'lavalink-client';
import { Test, TestingModule } from '@nestjs/testing';

import { LavalinkUtilsProvider } from '../../src/providers/lavalink-utils.provider.js';
import { LAVALINK_MANAGER, LAVALINK_UTILS } from '../../src/constants/index.js';

describe('LavalinkUtilsProvider', () => {
	let moduleRef: TestingModule;

	afterEach(async () => {
		if (moduleRef) {
			await moduleRef.close();
		}
	});

	it('should return utils from LavalinkManager', async () => {
		const mockUtils = { buildTrack: vi.fn<(...args: any[]) => any>() };
		const mockLavalinkManager = {
			utils: mockUtils
		} as unknown as LavalinkManager;

		moduleRef = await Test.createTestingModule({
			providers: [
				LavalinkUtilsProvider,
				{ provide: LAVALINK_MANAGER, useValue: mockLavalinkManager }
			]
		}).compile();

		const utils = moduleRef.get<ManagerUtils>(LAVALINK_UTILS);
		expect(utils).toBe(mockUtils);
	});

	it('should handle LavalinkManager with null utils', async () => {
		const mockLavalinkManager = {
			utils: null
		} as unknown as LavalinkManager;

		moduleRef = await Test.createTestingModule({
			providers: [
				LavalinkUtilsProvider,
				{ provide: LAVALINK_MANAGER, useValue: mockLavalinkManager }
			]
		}).compile();

		const utils = moduleRef.get<ManagerUtils>(LAVALINK_UTILS);
		expect(utils).toBeNull();
	});

	it('should handle LavalinkManager with undefined utils', async () => {
		const mockLavalinkManager = {
			utils: undefined
		} as unknown as LavalinkManager;

		moduleRef = await Test.createTestingModule({
			providers: [
				LavalinkUtilsProvider,
				{ provide: LAVALINK_MANAGER, useValue: mockLavalinkManager }
			]
		}).compile();

		const utils = moduleRef.get<ManagerUtils>(LAVALINK_UTILS);
		expect(utils).toBeUndefined();
	});
});
