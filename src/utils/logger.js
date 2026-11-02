const COLORS = {
  RESET: '\x1b[0m',
  GRAY: '\x1b[90m',
  WHITE: '\x1b[37m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m'
};

const getTimestamp = () => {
  const timeZone = process.env.LOG_TIMEZONE || 'UTC';
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23'
    }).format(new Date()).replace(',', '');
  } catch {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23'
    }).format(new Date()).replace(',', '');
  }
};

const formatArg = (arg) => {
  if (arg instanceof Error) {
    return arg.stack || arg.message || String(arg);
  }
  if (typeof arg === 'object' && arg !== null) {
    try {
      return JSON.stringify(arg);
    } catch {
      return String(arg);
    }
  }
  return String(arg);
};

const log = (type, color, ...args) => {
  try {
    const timestamp = getTimestamp();
    const message = args.map(formatArg).join(' ');
    console.log(`${COLORS.GRAY}[${timestamp}]${COLORS.RESET} ${color}[${type}]${COLORS.RESET} ${COLORS.WHITE}${message}${COLORS.RESET}`);
  } catch {
    console.log(`${COLORS.RED}[ERROR]${COLORS.RESET} ${COLORS.WHITE}Logging failure occurred.${COLORS.RESET}`);
  }
};

export const logger = {
  info: (...args) => log('INFO', COLORS.WHITE, ...args),
  success: (...args) => log('SUCCESS', COLORS.GREEN, ...args),
  warn: (...args) => log('WARN', COLORS.YELLOW, ...args),
  error: (...args) => log('ERROR', COLORS.RED, ...args)
};

export default logger;
