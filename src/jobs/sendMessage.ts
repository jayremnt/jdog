import { TextChannel } from 'discord.js';

import { Ctx } from '@/types/discord';

const sendMessage = async (
  ctx: Ctx,
  channelID: string,
  message: string,
  { referenceMessageID }: { referenceMessageID?: string } = {}
) => {
  const json: {
    content: string;
    reply?: {
      messageReference: string;
    };
  } = {
    content: message,
  };

  if (referenceMessageID) {
    json.reply = { messageReference: referenceMessageID };
  }

  const channel = await ctx.client.channels.fetch(channelID);
  if (!channel) {
    return console.error(`Channel ${channelID} not found`);
  }
  await (channel as TextChannel).send(json);
};

export default sendMessage;
