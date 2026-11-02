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
    logger.error(`Komut dağıtımı için gerekli ortam değişkenleri eksik: ${missing.join(', ')}`);
    process.exit(1);
  }

  logger.info('Dağıtım için komutlar okunuyor...');
  const commands = [];
  const commandsPath = join(process.cwd(), 'src', 'commands');
  let commandFiles = [];

  try {
    commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
  } catch (error) {
    logger.error('Komutlar dizini okunamadı:', error);
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
        logger.warn(`Geçersiz komut dosyası atlanıyor: ${file}`);
      }
    } catch (error) {
      logger.error(`${file} komut dosyası yüklenemedi:`, error);
    }
  }

  const rest = new REST().setToken(token);

  try {
    logger.info(`${commands.length} adet uygulama (/) komutu yenilenmeye başlandı.`);

    if (guildId && guildId.trim().length > 0) {
      const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId.trim()),
        { body: commands }
      );
      logger.success(`${guildId.trim()} sunucusu için ${data.length} adet uygulama (/) komutu başarıyla yüklendi.`);
    } else {
      const data = await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands }
      );
      logger.success(`${data.length} adet genel uygulama (/) komutu başarıyla yüklendi.`);
    }
  } catch (error) {
    logger.error('Uygulama komutları dağıtılırken hata oluştu:', error);
    process.exit(1);
  }
};

deployCommands();
