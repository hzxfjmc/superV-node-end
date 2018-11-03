import * as Koa from 'koa';
import { Context } from 'koa';
import * as Redlock from 'redlock';
import { Sequelize } from 'sequelize-typescript';
import * as Logger from 'winston';
import { Config } from '../config/config';
import { RedisClient } from '../middleware/model/redis_client';
import { UserDevice } from '../model/common/user_device';
import * as FdfsClient from 'fdfs';

export interface CoreContext extends Context {
    cookieOption: any;
    session: any;
    sessionKey: string;
    sessionId: string;
    userDevice: UserDevice;
    app: Core;
    /**
     * 用户信息
     */
    userAuthInfo: {
        userId: string;
    };
}

export class Core extends Koa {
    /**
     * @description 应用配置
     * @type {Config}
     * @memberof Core
     */
    public config: Config;
    /**
     * @description 同步锁
     * @type {Redlock}
     * @memberof Core
     */
    public redLock: Redlock;
    /**
     * @description redis客户端
     * @memberof Core
     */
    public redisClient: RedisClient;
    /**
     * @description 上下文
     * @type {CoreContext}
     * @memberof Core
     */
    public context: CoreContext;
    /**
     * @description
     * Sequelize
     * @type {Sequelize}
     * @memberof Core
     */
    public sequelize: Sequelize;
    /**
     * @description
     * 日志
     * @type {Logger}
     * @memberof Core
     */
    public logger: Logger.Logger;

    /**
     * @description fastdfs客户端
     */
    public fdfs: FdfsClient;

    constructor() {
        super();
    };
}
