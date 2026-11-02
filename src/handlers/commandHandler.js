import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import logger from '../utils/logger.js';

export const loadCommands = async (client) => {
  logger.info('Komutlar yükleniyor...');
  const commandsPath = join(process.cwd(), 'src', 'commands');
  let commandFiles = [];

  try {
    commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
  } catch (error) {
    logger.error('Komutlar dizini okunamadı:', error);
    return;
  }

  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    try {
      const commandModule = await import(pathToFileURL(filePath).href);
      const command = commandModule.data && commandModule.execute ? commandModule : commandModule.default;

      if (!command || !command.data?.name || typeof command.execute !== 'function') {
        logger.warn(`${file} dosyasında geçersiz komut yapısı.`);
        continue;
      }

      if (client.commands.has(command.data.name)) {
        logger.warn(`Yinelenen komut tespit edildi: "${command.data.name}" (${file}).`);
        continue;
      }

      client.commands.set(command.data.name, command);
    } catch (error) {
      logger.error(`${file} komutu yüklenemedi:`, error);
    }
  }

  logger.success('Komutlar başarıyla yüklendi.');
};
