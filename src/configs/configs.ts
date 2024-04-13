import {Config} from "./config.type";
import * as process from 'node:process';

export default (): Config => ({
    app: {
        port: parseInt(process.env.APP_PORT) || 3000,
        host: process.env.APP_HOST || '0.0.0.0',
    },
});