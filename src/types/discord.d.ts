import { Client, CommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface Ctx {
  client: Client;
}

export interface SlashCommand {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
}
