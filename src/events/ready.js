import { ActivityType, Events } from 'discord.js';
import logger from '../utils/logger.js';

export const name = Events.ClientReady;
export const once = true;

export const execute = (client) => {
  client.user.setPresence({
    activities: [{ name: 'github.com/BenIbo20', state: 'github.com/BenIbo20', type: ActivityType.Custom }],
    status: 'online'
  });
  logger.success(`Discord bağlantısı kuruldu. ${client.user.tag} olarak giriş yapıldı.`);
};
