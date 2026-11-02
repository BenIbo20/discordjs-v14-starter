import { Events } from 'discord.js';
import logger from '../utils/logger.js';

export const name = Events.ClientReady;
export const once = true;

export const execute = (client) => {
  logger.success(`Discord connection established. Logged in as ${client.user.tag}`);
};

