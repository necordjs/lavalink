import { NecordLavalinkService } from '../src';
import {
	Message,
	ChatInputCommandInteraction,
	Guild,
	TextChannel,
	VoiceChannel,
	GuildMember
} from 'discord.js';
import { LavalinkManager, Player } from 'lavalink-client';

describe('NecordLavalinkService', () => {
	let service: NecordLavalinkService;
	let mockClient: any;
	let mockLavalinkManager: Partial<LavalinkManager>;

	beforeEach(() => {
		mockClient = {
			guilds: { fetch: jest.fn() },
			channels: { fetch: jest.fn() }
		};

		mockLavalinkManager = {
			utils: {} as any
		};

		service = new NecordLavalinkService(mockClient, mockLavalinkManager as LavalinkManager);
	});

	it('should expose lavalinkUtils', () => {
		expect(service.lavalinkUtils).toBe(mockLavalinkManager.utils);
	});

	describe('extractInfoForPlayer', () => {
		it('should extract info from a Message', () => {
			const mockMember = {
				voice: { channelId: 'voice1' }
			} as unknown as GuildMember;

			const message = Object.create(Message.prototype);
			Object.defineProperty(message, 'guildId', { value: 'guild1' });
			Object.defineProperty(message, 'channelId', { value: 'text1' });
			Object.defineProperty(message, 'member', { value: mockMember });

			const info = service.extractInfoForPlayer(message);

			expect(info).toEqual({
				guildId: 'guild1',
				textChannelId: 'text1',
				voiceChannelId: 'voice1'
			});
		});

		it('should extract info from a ChatInputCommandInteraction', () => {
			const mockMember = {
				voice: { channelId: 'voice2' }
			} as unknown as GuildMember;

			const interaction = Object.create(ChatInputCommandInteraction.prototype);
			Object.defineProperty(interaction, 'guildId', { value: 'guild2' });
			Object.defineProperty(interaction, 'channelId', { value: 'text2' });
			Object.defineProperty(interaction, 'member', { value: mockMember });

			const info = service.extractInfoForPlayer(interaction);

			expect(info).toEqual({
				guildId: 'guild2',
				textChannelId: 'text2',
				voiceChannelId: 'voice2'
			});
		});
	});

	describe('extractPlayerData', () => {
		it('should fetch guild correctly', async () => {
			const mockGuild = {} as Guild;

			mockClient.guilds.fetch.mockResolvedValue(mockGuild);
			mockClient.channels.fetch.mockResolvedValue({} as VoiceChannel);

			const player = {
				guildId: 'guildId1',
				voiceChannelId: 'voiceId1',
				textChannelId: 'textId1'
			} as Player;

			const data = await service.extractPlayerData(player);

			expect(mockClient.guilds.fetch).toHaveBeenCalledWith('guildId1');
			expect(data.guild).toBe(mockGuild);
		});

		it('should fetch voice channel correctly', async () => {
			const mockVoiceChannel = {} as VoiceChannel;

			mockClient.guilds.fetch.mockResolvedValue({} as Guild);
			mockClient.channels.fetch
				.mockResolvedValueOnce(mockVoiceChannel)
				.mockResolvedValueOnce({} as TextChannel);

			const player = {
				guildId: 'guildId1',
				voiceChannelId: 'voiceId1',
				textChannelId: 'textId1'
			} as Player;

			const data = await service.extractPlayerData(player);

			expect(mockClient.channels.fetch).toHaveBeenCalledWith('voiceId1');
			expect(data.voiceChannel).toBe(mockVoiceChannel);
		});

		it('should fetch text channel correctly', async () => {
			const mockTextChannel = {} as TextChannel;

			mockClient.guilds.fetch.mockResolvedValue({} as Guild);
			mockClient.channels.fetch
				.mockResolvedValueOnce({} as VoiceChannel)
				.mockResolvedValueOnce(mockTextChannel);

			const player = {
				guildId: 'guildId1',
				voiceChannelId: 'voiceId1',
				textChannelId: 'textId1'
			} as Player;

			const data = await service.extractPlayerData(player);

			expect(mockClient.channels.fetch).toHaveBeenCalledWith('textId1');
			expect(data.textChannel).toBe(mockTextChannel);
		});
	});
});
