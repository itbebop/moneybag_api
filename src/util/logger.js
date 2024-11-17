import logger from 'pino';
import { colorizerFactory } from 'pino-pretty';

const log = logger({
    base: { pid: false },
    transport: { 
        target: 'pino-pretty',
        options: {
            colorized: true
        },
        timestamp: () => `,"time": "${new Date().toLocaleString()}"`
    }
});

export default log;