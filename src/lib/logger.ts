const getTimestamp = (): string => {
  const d = new Date();
  const pad = (n: number, z = 2) => String(n).padStart(z, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
};

export const clientLogger = {
  info: (message: string, data?: any) => {
    if (typeof window !== 'undefined') {
      console.log(
        `%c[${getTimestamp()}] [TOTO-CLIENT-INFO]%c ${message}`,
        'color: #79b8a7; font-weight: bold;',
        'color: inherit;',
        data !== undefined ? data : ''
      );
    }
  },
  warn: (message: string, data?: any) => {
    if (typeof window !== 'undefined') {
      console.warn(
        `%c[${getTimestamp()}] [TOTO-CLIENT-WARN]%c ${message}`,
        'color: #f59e0b; font-weight: bold;',
        'color: inherit;',
        data !== undefined ? data : ''
      );
    }
  },
  error: (message: string, error?: any, reqId?: string) => {
    if (typeof window !== 'undefined') {
      console.error(
        `%c[${getTimestamp()}] [TOTO-CLIENT-ERROR]${reqId ? ` [Trace: ${reqId}]` : ''}%c ${message}`,
        'color: #ef4444; font-weight: bold;',
        'color: inherit;',
        error !== undefined ? error : ''
      );
    }
  },
  race: (message: string, data?: any) => {
    if (typeof window !== 'undefined') {
      console.log(
        `%c[${getTimestamp()}] [⚡ CONCURRENCY]%c ${message}`,
        'color: #a855f7; font-weight: bold; background: rgba(168,85,247,0.1); padding: 2px 4px; border-radius: 4px;',
        'color: inherit;',
        data !== undefined ? data : ''
      );
    }
  },
};
