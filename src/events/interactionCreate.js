import { Events } from 'discord.js';
import logger from '../utils/logger.js';

export const name = Events.InteractionCreate;

export const execute = async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    logger.warn(`${interaction.commandName} adında bir komut bulunamadı.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(`${interaction.commandName} komutu yürütülürken hata oluştu:`, error);

    const replyPayload = {
      content: 'Bu komut yürütülürken bir hata oluştu.',
      ephemeral: true
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(replyPayload).catch((err) => {
        logger.error('Hata bildirimi (followUp) gönderilemedi:', err);
      });
    } else {
      await interaction.reply(replyPayload).catch((err) => {
        logger.error('Hata bildirimi (reply) gönderilemedi:', err);
      });
    }
  }
};
