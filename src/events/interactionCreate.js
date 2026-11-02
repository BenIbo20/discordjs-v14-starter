import { Events } from 'discord.js';
import logger from '../utils/logger.js';

export const name = Events.InteractionCreate;

export const execute = async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    logger.warn(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(`Error executing command ${interaction.commandName}:`, error);

    const replyPayload = {
      content: 'There was an error while executing this command.',
      ephemeral: true
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(replyPayload).catch((err) => {
        logger.error('Error sending error followUp:', err);
      });
    } else {
      await interaction.reply(replyPayload).catch((err) => {
        logger.error('Error sending error reply:', err);
      });
    }
  }
};

