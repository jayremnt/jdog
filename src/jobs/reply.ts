import { Client, TextChannel } from 'discord.js';

const reply = async (
  client: Client,
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

  const channel = await client.channels.fetch(channelID);
  if (!channel) {
    return console.log(`Channel ${channelID} not found`);
  }
  await (channel as TextChannel).send(json);
};

export default reply;
