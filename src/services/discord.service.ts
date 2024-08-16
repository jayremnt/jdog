import path from 'node:path';
import fs from 'node:fs';

import {
  ApplicationCommandDataResolvable,
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
} from 'discord.js';

import appConfigs from '@/configs/app.config';
import type { SlashCommand } from '@/types/discord';
import findJob from '@/utils/findJob';
import reply from '@/jobs/reply';

export default class DiscordService {
  public slashCommandsCollection = new Collection<string, SlashCommand>();

  public slashCommands: ApplicationCommandDataResolvable[] = [];

  private client: Client;

  public constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    });
  }

  public init = async () => {
    await this.login();
    // await this.registerSlashCommands();
    // this.onInteractionCreate();
    this.onMessageCreate();
  };

  private login = async () => {
    await this.client.login(appConfigs.DISCORD_TOKEN);

    return new Promise<void>((resolve) => {
      this.client.once(Events.ClientReady, (readyClient) => {
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
    const rest = new REST().setToken(appConfigs.DISCORD_TOKEN);

    try {
      await this.loadSlashCommands();

      console.log(
        `Started refreshing ${this.slashCommands.length} application (/) commands.`
      );

      const data: any = await rest.put(
        Routes.applicationGuildCommands(
          appConfigs.DISCORD_CLIENT_ID,
          appConfigs.DISCORD_GUILD_ID
        ),
        { body: this.slashCommands }
      );

      console.log(
        `Successfully reloaded ${data.length} application (/) commands.`
      );
    } catch (error) {
      console.error(error);
    }
  };

  private onInteractionCreate = () => {
    this.client.on(Events.InteractionCreate, async (interaction) => {
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
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: 'There was an error while executing this command!',
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
          });
        }
      }
    });
  };

  private onMessageCreate = () => {
    this.client.on(Events.MessageCreate, async (message) => {
      if (message.author.bot) return;

      const channelID = message.channelId;
      const messageID = message.id;
      const messageContent = message.content;

      const job = findJob(messageContent);
      if (!job) return;

      switch (job.name) {
        case 'ping':
        case 'question':
          await reply(this.client, channelID, job.response, {
            referenceMessageID: messageID,
          });
          break;

        default:
          break;
      }
    });
  };
}
