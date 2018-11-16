import * as path from 'path';

import { DBConfig } from './model/DBConfig';
import { DBConfigPool } from './model/DBConfigPool';
import { IApolloConfig, IFastDFSConfig } from './model/IApolloConfig';
import { RedisConfig } from './model/RedisConfig';
import { ScheduleConfig } from './model/ScheduleConfig';

/**
 * @description 启动配置
 * @export
 * @class Config
 */
export class Config {
    constructor(options, env) {
        const opts = options as IApolloConfig;

        this.port = Number(opts.PORT) || 3030;
        this.redis = new RedisConfig(opts.REDIS_CLIENT_ADDR, opts.REDIS_CLIENT_AUTH_PWD);
        this.dbConfig = new DBConfig(opts.SQL_HOST, Number(opts.SQL_PORT), opts.SQL_NAME, opts.SQL_USER, opts.SQL_AUTH_PWD, opts.SQL_PWD_ENCRYPT_KEY);
        this.dbConfig.pool = new DBConfigPool(opts.SQL_POOL_MAX, opts.SQL_POOL_MIN, opts.SQL_POOL_IDLE);
        // this.scheduleConfig = new ScheduleConfig(opts);
        this.env = env;
        this.apiPrefix = '/super_api';
        // this.deployOrigin = opts.ACTIVITY_DEPLOY_ORIGIN;
        // this.staticOrigin = opts.STATIC_FILE_ORIGIN;
        this.paths = {
            pushPath: opts.PUSH_PATH,
            stashPath: opts.STASH_PATH
        };
    }

    /**
     * @description 目录地址
     */
    public paths: any;
    /**
     * @description 应用名称
     * @type {string}
     * @memberof Config
     */
    public name: string = 'superY';
    /**
     * @description 版本号
     * @type {string}
     * @memberof Config
     */
    public version: string = '1.0.0';
    /**
     * @description 应用端口号
     * @type {Number}
     * @memberof Config
     */
    public port: number;
    /**
     * @description 环境(development,production)
     * @type {string}
     * @memberof Config
     */
    public env: string = 'production';
    /**
     * @description 项目根目录
     * @type {string}
     * @memberof Config
     */
    public rootPath: string = path.join(__dirname + '/../');
    /**
     * @description 请求路由前缀
     * @type {string}
     * @memberof Config
     */
    public apiPrefix: string; // 请求路由前缀

    public deployOrigin: string; // 发布的活动页的origin

    public enableCompress: true = true;
    /**
     * @description redis配置
     * @type {RedisConfig}
     * @memberof RedisConfig
     */
    public redis: RedisConfig;

    /**
     * @description 数据库配置
     * @type {DBConfig}
     * @memberof Config
     */
    public dbConfig: DBConfig;

    /**
     * @description 微服务地址配置
     * @type {*}
     * @memberof Config
     */
    public msvUrl: any;

    /**
     * 定时任务
     */
    public scheduleConfig: ScheduleConfig;

    /**
     * 静态文件origin
     */
    public staticOrigin: string;

    public fastdfsTrackers: IFastDFSConfig;

    public urlPrefix: string;
}
