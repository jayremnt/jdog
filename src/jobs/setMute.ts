import { Message } from 'discord.js';

import sendMessage from '@/jobs/sendMessage';
import i18n from '@/configs/i18n.config';
import { Ctx } from '@/types/discord';

const setMute = async (
  ctx: Ctx,
  referenceMessage: Message,
  mute: boolean,
  userIDs: string[],
  {
    reason,
  }: {
    reason?: string;
  } = {}
) => {
  const { guild } = referenceMessage;
  const channelID = referenceMessage.channel.id;

  if (!userIDs.length) {
    return sendMessage(ctx, channelID, i18n.__('please_provide_users'));
  }

  for (const user of userIDs) {
    const member = await guild!.members.fetch({
      user,
      force: true,
    });
    if (member?.voice?.channel) await member.voice.setMute(mute, reason);
  }

  return sendMessage(
    ctx,
    channelID,
    i18n.__(mute ? 'muted_users' : 'unmuted_users'),
    {
      referenceMessageID: referenceMessage.id,
    }
  );
};

export default setMute;
