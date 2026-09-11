type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_ORDER: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

const SENSITIVE_KEY_PATTERN = /(password|secret|token|apikey|api_key|authorization|cookie)/i;

function resolveLevel(): LogLevel {
  const raw = process.env.LOG_LEVEL?.toLowerCase();
  if (raw === 'debug' || raw === 'warn' || raw === 'error') return raw;
  return 'info';
}

const currentLevel = resolveLevel();

/**
 * Recursively redacts values whose keys look sensitive so secrets can never
 * leak into logs.
 */
function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact);
  if (value !== null && typeof value === 'object') {
    const copy: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      copy[key] = SENSITIVE_KEY_PATTERN.test(key) ? '[REDACTED]' : redact(val);
    }
    return copy;
  }
  return value;
}

function log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
  if (LEVEL_ORDER[level] < LEVEL_ORDER[currentLevel]) return;
  const timestamp = new Date().toISOString();
  const details = context ? ` ${JSON.stringify(redact(context))}` : '';
  const line = `[${timestamp}] [${level.toUpperCase()}] ${message}${details}`;
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

/** Structured logger with secret redaction. Never log credentials through it. */
export const logger = {
  debug: (message: string, context?: Record<string, unknown>): void => log('debug', message, context),
  info: (message: string, context?: Record<string, unknown>): void => log('info', message, context),
  warn: (message: string, context?: Record<string, unknown>): void => log('warn', message, context),
  error: (message: string, context?: Record<string, unknown>): void => log('error', message, context),
};
