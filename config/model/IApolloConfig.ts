/**
 * @description apollo配置
 * @author cairc
 * @interface IApolloConfig
 */
export interface IApolloConfig {
    PORT: string;
    REDIS_CLIENT_ADDR: string;
    REDIS_CLIENT_AUTH_PWD: string;
    SQL_AUTH_PWD: string;
    SQL_HOST: string;
    SQL_NAME: string;
    SQL_POOL_IDLE: string;
    SQL_POOL_MAX: string;
    SQL_POOL_MIN: string;
    SQL_PORT: string;
    SQL_USER: string;
    WX_APP_ID: string;
    WX_APP_SECRET: string;
    TOPIC_TIP: string;
    TOPIC_POINT_STEP: string;
    MSV_ACTIVITY: string;
    MSV_USER: string;
    MSV_CONSOLE_CENTER: string;
    MSV_CONSOLE_PRODUCT: string;
    ACTIVITY_DEPLOY_ORIGIN: string;
    PUSH_PATH: string;
    STASH_PATH: string;
    SQL_PWD_ENCRYPT_KEY: string;
    STATIC_FILE_ORIGIN: string;
    FAST_DFS_TRACKERS: string;
    URL_PREFIX: string;
}

/**
 * fastdfs配置
 */
export interface IFastDFSConfig {
    host: string;
    port: number;
}
