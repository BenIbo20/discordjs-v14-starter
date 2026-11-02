import 'dotenv/config';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import logger from './utils/logger.js';
import { loadCommands } from './handlers/commandHandler.js';
import { loadEvents } from './handlers/eventHandler.js';

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
});

const validateEnvironment = () => {
  const missing = [];
  if (!process.env.BOT_TOKEN) missing.push('BOT_TOKEN');
  if (!process.env.CLIENT_ID) missing.push('CLIENT_ID');

  if (missing.length > 0) {
    logger.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
};

const startBot = async () => {
  validateEnvironment();

  logger.info('Bot starting...');

  const client = new Client({
    intents: [GatewayIntentBits.Guilds]
  });

  client.commands = new Collection();

  await loadCommands(client);
  await loadEvents(client);

  try {
    await client.login(process.env.BOT_TOKEN);
  } catch (error) {
    logger.error('Failed to log in to Discord:', error);
    process.exit(1);
  }
};

startBot();

