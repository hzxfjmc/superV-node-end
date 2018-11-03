import * as path from 'path';
const rootPath = path.resolve(__dirname, '../../../');
// 默认配置
export const ConfigDefault = {
    PORT: 3030,
    // REDIS_CLIENT_ADDR: '172.29.1.168',
    // // REDIS_CLIENT_AUTH_PWD: 'a123456',
    // SQL_NAME: 'yyfax_cms', // 使用哪个数据库
    // SQL_USER: 'yjsdata', // 用户名
    // SQL_AUTH_PWD: 'yjsdata_123%', // 口令
    // SQL_HOST: '172.29.2.239', // 主机名
    // SQL_POOL_IDLE: 1000,
    // SQL_POOL_MAX: 5,
    // SQL_POOL_MIN: 0,
    // SQL_PORT: 3316,
    // MSV_ACTIVITY: 'http://activity.com',
    MSV_USER: '172.29.3.127',
    MSV_CONSOLE_PRODUCT: 'http://172.29.1.181:8180',
    // MSV_CONSOLE_CENTER: 'http://172.29.1.175',
    PUSH_PATH: path.resolve(rootPath, 'public/assets/h5/newActivity/'),
    STASH_PATH: path.resolve(rootPath, 'public/assets/h5/newPreview/'),
    // FAST_DFS_TRACKERS: [{
    //     host: '172.29.1.177',
    //     port: 22122
    // }],
    // URL_PREFIX: 'http://172.29.1.177:6060/'
};
