import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import logger from '../utils/logger.js';

export const loadEvents = async (client) => {
  logger.info('Loading events...');
  const eventsPath = join(process.cwd(), 'src', 'events');
  let eventFiles = [];

  try {
    eventFiles = readdirSync(eventsPath).filter((file) => file.endsWith('.js'));
  } catch (error) {
    logger.error('Failed to read events directory:', error);
    return;
  }

  for (const file of eventFiles) {
    const filePath = join(eventsPath, file);
    try {
      const eventModule = await import(pathToFileURL(filePath).href);
      const event = eventModule.name && eventModule.execute ? eventModule : eventModule.default;

      if (!event || !event.name || typeof event.execute !== 'function') {
        logger.warn(`Invalid event structure in ${file}.`);
        continue;
      }

      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    } catch (error) {
      logger.error(`Failed to load event ${file}:`, error);
    }
  }

  logger.success('Events loaded successfully.');
};

