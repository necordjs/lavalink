import { Test, TestingModule } from '@nestjs/testing';
import { ManagerUtils, LavalinkManager } from 'lavalink-client';
import { LavalinkUtilsProvider } from '../../src/providers/lavalink-utils.provider';

describe('LavalinkUtilsProvider', () => {
	let moduleRef: TestingModule;

	afterEach(async () => {
		if (moduleRef) {
			await moduleRef.close();
		}
	});

	it('should return utils from LavalinkManager', async () => {
		const mockUtils = { buildTrack: jest.fn() };
		const mockLavalinkManager = {
			utils: mockUtils
		} as unknown as LavalinkManager;

		moduleRef = await Test.createTestingModule({
			providers: [
				LavalinkUtilsProvider,
				{ provide: LavalinkManager, useValue: mockLavalinkManager }
			]
		}).compile();

		const utils = moduleRef.get<ManagerUtils>(ManagerUtils);
		expect(utils).toBe(mockUtils);
	});

	it('should handle LavalinkManager with null utils', async () => {
		const mockLavalinkManager = {
			utils: null
		} as unknown as LavalinkManager;

		moduleRef = await Test.createTestingModule({
			providers: [
				LavalinkUtilsProvider,
				{ provide: LavalinkManager, useValue: mockLavalinkManager }
			]
		}).compile();

		const utils = moduleRef.get<ManagerUtils>(ManagerUtils);
		expect(utils).toBeNull();
	});

	it('should handle LavalinkManager with undefined utils', async () => {
		const mockLavalinkManager = {
			utils: undefined
		} as unknown as LavalinkManager;

		moduleRef = await Test.createTestingModule({
			providers: [
				LavalinkUtilsProvider,
				{ provide: LavalinkManager, useValue: mockLavalinkManager }
			]
		}).compile();

		const utils = moduleRef.get<ManagerUtils>(ManagerUtils);
		expect(utils).toBeUndefined();
	});
});
