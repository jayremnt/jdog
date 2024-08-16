import * as dotenv from 'dotenv';

dotenv.config({
  path: '.env.local',
});

const appConfigs = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN || '',
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID || '',
  DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID || '',
};

export default appConfigs;
