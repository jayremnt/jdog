import DiscordService from '@/services/discord.service';

const bot = new DiscordService();
bot.init().then();
