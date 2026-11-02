import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import logger from '../utils/logger.js';

export const loadEvents = async (client) => {
  logger.info('Olaylar (events) yükleniyor...');
  const eventsPath = join(process.cwd(), 'src', 'events');
  let eventFiles = [];

  try {
    eventFiles = readdirSync(eventsPath).filter((file) => file.endsWith('.js'));
  } catch (error) {
    logger.error('Olaylar dizini okunamadı:', error);
    return;
  }

  for (const file of eventFiles) {
    const filePath = join(eventsPath, file);
    try {
      const eventModule = await import(pathToFileURL(filePath).href);
      const event = eventModule.name && eventModule.execute ? eventModule : eventModule.default;

      if (!event || !event.name || typeof event.execute !== 'function') {
        logger.warn(`${file} dosyasında geçersiz olay yapısı.`);
        continue;
      }

      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    } catch (error) {
      logger.error(`${file} olayı yüklenemedi:`, error);
    }
  }

  logger.success('Olaylar başarıyla yüklendi.');
};
