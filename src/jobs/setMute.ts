import sendMessage from '@/jobs/sendMessage';
import appConfigs from '@/configs/app.config';
import i18n from '@/configs/i18n.config';
import { Ctx } from '@/types/discord';

const setMute = async (
  ctx: Ctx,
  mute: boolean,
  userIDs: string[],
  channelID: string,
  {
    referenceMessageID,
    reason,
  }: {
    referenceMessageID?: string;
    reason?: string;
  } = {}
) => {
  if (!userIDs.length) {
    return sendMessage(ctx, channelID, i18n.__('please_provide_users'));
  }

  const guild = ctx.client.guilds.cache.get(appConfigs.DISCORD_GUILD_ID);
  if (!guild) {
    return console.error(`Guild ${appConfigs.DISCORD_GUILD_ID} not found`);
  }

  for (const user of userIDs) {
    const member = guild.members.cache.get(user);
    if (member?.voice?.channel) await member.voice.setMute(mute, reason);
  }

  return sendMessage(ctx, channelID, i18n.__('muted_users'), {
    referenceMessageID,
  });
};

export default setMute;
