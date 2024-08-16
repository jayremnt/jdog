import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Ping');

export const execute = async (interaction: CommandInteraction) => {
  await interaction.reply(`Ping cl`);
};
