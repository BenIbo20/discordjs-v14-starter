import 'dotenv/config';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import logger from './utils/logger.js';
import { loadCommands } from './handlers/commandHandler.js';
import { loadEvents } from './handlers/eventHandler.js';

process.on('uncaughtException', (error) => {
  logger.error('Yakalanmayan Hata (uncaughtException):', error);
});

process.on('unhandledRejection', (reason) => {
  logger.error('İşlenmeyen Promise Reddi (unhandledRejection):', reason);
});

const validateEnvironment = () => {
  const missing = [];
  if (!process.env.BOT_TOKEN) missing.push('BOT_TOKEN');
  if (!process.env.CLIENT_ID) missing.push('CLIENT_ID');

  if (missing.length > 0) {
    logger.error(`Gerekli ortam değişkenleri eksik: ${missing.join(', ')}`);
    process.exit(1);
  }
};

const startBot = async () => {
  validateEnvironment();

  logger.info('Bot başlatılıyor...');

  const client = new Client({
    intents: [GatewayIntentBits.Guilds]
  });

  client.commands = new Collection();

  await loadCommands(client);
  await loadEvents(client);

  try {
    await client.login(process.env.BOT_TOKEN);
  } catch (error) {
    logger.error('Discord\'a giriş yapılamadı:', error);
    process.exit(1);
  }
};

startBot();
