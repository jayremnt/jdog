import { Client, GatewayIntentBits } from 'discord.js';

import DiscordService from '@/services/discord.service';

const bot = new DiscordService(
  new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildVoiceStates,
    ],
  })
);
bot.init().then();
