import path from 'node:path';
import fs from 'node:fs';

import {
  ApplicationCommandDataResolvable,
  Client,
  Collection,
  Events,
} from 'discord.js';

import appConfigs from '@/configs/app.config';
import i18n from '@/configs/i18n.config';
import type { Ctx, SlashCommand } from '@/types/discord';
import findJob from '@/utils/findJob';
import sendMessage from '@/jobs/sendMessage';
import setMute from '@/jobs/setMute';

export default class DiscordService {
  slashCommandsCollection = new Collection<string, SlashCommand>();

  slashCommands: ApplicationCommandDataResolvable[] = [];

  private readonly ctx: Ctx;

  constructor(private readonly client: Client) {
    this.ctx = { client: this.client };
  }

  init = async () => {
    await this.login();
    // await this.registerSlashCommands();
    // this.onInteractionCreate();
    this.onMessages();
  };

  private login = async () => {
    await this.ctx.client.login(appConfigs.DISCORD_TOKEN);

    return new Promise<void>((resolve) => {
      this.ctx.client.once(Events.ClientReady, (readyClient) => {
        console.log(`Ready! Logged in as ${readyClient.user.tag}`);
        resolve();
      });
    });
  };

  private loadSlashCommands = async () => {
    const foldersPath = path.join(__dirname, '..', 'commands');
    const commandFiles = fs
      .readdirSync(foldersPath)
      .filter((file) => file.endsWith('.ts'));

    for (const file of commandFiles) {
      const filePath = path.join(foldersPath, file);
      const command = await import(filePath);
      this.slashCommandsCollection.set(command.data.name, command);
      this.slashCommands.push(command.data.toJSON());
    }
  };

  private registerSlashCommands = async () => {
    // const rest = new REST().setToken(appConfigs.DISCORD_TOKEN);

    try {
      await this.loadSlashCommands();

      console.log(
        `Started refreshing ${this.slashCommands.length} application (/) commands.`
      );

      // TODO: load joined guilds
      // const data: any = await rest.put(
      //   Routes.applicationGuildCommands(
      //     appConfigs.DISCORD_CLIENT_ID,
      //     appConfigs.DISCORD_GUILD_ID
      //   ),
      //   { body: this.slashCommands }
      // );
      //
      // console.log(
      //   `Successfully reloaded ${data.length} application (/) commands.`
      // );
    } catch (e) {
      console.error(e);
    }
  };

  private onInteractionCreate = () => {
    this.ctx.client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const command = this.slashCommandsCollection.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );

        return;
      }

      try {
        await command.execute(interaction);
      } catch (e) {
        console.error(e);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: i18n.__('error_occurred'),
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: i18n.__('error_occurred'),
            ephemeral: true,
          });
        }
      }
    });
  };

  private onMessages = () => {
    this.ctx.client.on(Events.MessageCreate, async (message) => {
      if (message.author.bot) return;

      const channelID = message.channelId;
      const messageID = message.id;
      const messageContent = message.content;
      const { users: mentionsUsers } = message.mentions;

      try {
        const job = findJob(messageContent);
        if (!job) return;

        switch (job.name) {
          case 'ping':
            await sendMessage(this.ctx, channelID, i18n.__('ping'), {
              referenceMessageID: messageID,
            });
            break;
          case 'question':
            await sendMessage(this.ctx, channelID, i18n.__('question'), {
              referenceMessageID: messageID,
            });
            break;
          case 'mute':
            await setMute(
              this.ctx,
              message,
              true,
              mentionsUsers.map((u) => u.id)
            );
            break;
          case 'unmute':
            await setMute(
              this.ctx,
              message,
              false,
              mentionsUsers.map((u) => u.id)
            );
            break;
          default:
            break;
        }
      } catch (e) {
        await sendMessage(this.ctx, channelID, i18n.__('error_occurred'));
        console.error(e);
      }
    });
  };
}
