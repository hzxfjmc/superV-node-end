import * as winston from 'winston';
import { Apollo } from './config/apollo';
import { Config } from './config/config';
import { ConfigDefault } from './config/config.default';
import { Core } from './core/core';
import MomentFormat from './helper/moment_helper';
import { EnginesHelper } from './middleware/engines_helper';
import * as fs from 'fs';
import * as path from 'path';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: () => MomentFormat.moment().format() }),
        winston.format.printf(info => {
            return `[${info.timestamp}] ${info.level}: ${info.message}`;
        })
    ),
    transports: [
        new winston.transports.Console({})
    ]
});

class App {
    private apollo: Apollo;
    constructor() {
        this.apollo = new Apollo(logger);
        this.initConfig();
    }

    private async initConfig() {
        const apolloConfigObj = await this.apollo.fetchApolloConfig();
        const configObj = { ...ConfigDefault, ...apolloConfigObj };
        const config = new Config(configObj, process.env.NODE_ENV || 'production');
        const core = new Core();
        core.logger = logger;
        core.config = config;
        App.createFolder(config.paths.pushPath, (err) => {
            if (err) logger.error(err);
        });
        App.createFolder(config.paths.stashPath, (err) => {
            if (err) logger.error(err);
        });
        const enginesProxy = new EnginesHelper();
        enginesProxy.decoratorContext(core);
        core.listen(config.port, () => {
            logger.info(
                `[info]Application is OK\n` +
                `[info]time: ${new Date()}\n` +
                `[info]port: ${config.port}\n`);
        });
    }

    /**
     * @description 创建文件夹
     * @param dirpath
     * @param callback
     */
    private static createFolder(dirpath, callback) {
        fs.access(dirpath, fs.constants.F_OK | fs.constants.W_OK, err => {
            if (!err) {
                callback();
            } else {
                App.createFolder(path.dirname(dirpath), () => {
                    fs.mkdir(dirpath, callback);
                });
            }
        });
    }
}
const app = new App();

export default app;
