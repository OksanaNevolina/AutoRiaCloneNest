"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process = require("node:process");
exports.default = () => ({
    app: {
        port: parseInt(process.env.APP_PORT) || 3000,
        host: process.env.APP_HOST || '0.0.0.0',
    },
});
//# sourceMappingURL=configs.js.map