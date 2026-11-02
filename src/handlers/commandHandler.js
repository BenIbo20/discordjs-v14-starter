import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import logger from '../utils/logger.js';

export const loadCommands = async (client) => {
  logger.info('Loading commands...');
  const commandsPath = join(process.cwd(), 'src', 'commands');
  let commandFiles = [];

  try {
    commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
  } catch (error) {
    logger.error('Failed to read commands directory:', error);
    return;
  }

  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    try {
      const commandModule = await import(pathToFileURL(filePath).href);
      const command = commandModule.data && commandModule.execute ? commandModule : commandModule.default;

      if (!command || !command.data?.name || typeof command.execute !== 'function') {
        logger.warn(`Invalid command structure in ${file}.`);
        continue;
      }

      if (client.commands.has(command.data.name)) {
        logger.warn(`Duplicate command detected: "${command.data.name}" in ${file}.`);
        continue;
      }

      client.commands.set(command.data.name, command);
    } catch (error) {
      logger.error(`Failed to load command ${file}:`, error);
    }
  }

  logger.success('Commands loaded successfully.');
};

