import 'dotenv/config';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { REST, Routes } from 'discord.js';
import logger from './src/utils/logger.js';

const deployCommands = async () => {
  const token = process.env.BOT_TOKEN;
  const clientId = process.env.CLIENT_ID;
  const guildId = process.env.GUILD_ID;

  const missing = [];
  if (!token) missing.push('BOT_TOKEN');
  if (!clientId) missing.push('CLIENT_ID');

  if (missing.length > 0) {
    logger.error(`Missing required environment variables for deployment: ${missing.join(', ')}`);
    process.exit(1);
  }

  logger.info('Reading commands for deployment...');
  const commands = [];
  const commandsPath = join(process.cwd(), 'src', 'commands');
  let commandFiles = [];

  try {
    commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
  } catch (error) {
    logger.error('Failed to read commands directory:', error);
    process.exit(1);
  }

  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    try {
      const commandModule = await import(pathToFileURL(filePath).href);
      const command = commandModule.data && commandModule.execute ? commandModule : commandModule.default;

      if (command && command.data && typeof command.data.toJSON === 'function') {
        commands.push(command.data.toJSON());
      } else {
        logger.warn(`Skipping invalid command file: ${file}`);
      }
    } catch (error) {
      logger.error(`Failed to load command file ${file}:`, error);
    }
  }

  const rest = new REST().setToken(token);

  try {
    logger.info(`Started refreshing ${commands.length} application (/) commands.`);

    if (guildId && guildId.trim().length > 0) {
      const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId.trim()),
        { body: commands }
      );
      logger.success(`Successfully reloaded ${data.length} guild application (/) commands for guild ${guildId.trim()}.`);
    } else {
      const data = await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands }
      );
      logger.success(`Successfully reloaded ${data.length} global application (/) commands.`);
    }
  } catch (error) {
    logger.error('Failed to deploy application commands:', error);
    process.exit(1);
  }
};

deployCommands();

