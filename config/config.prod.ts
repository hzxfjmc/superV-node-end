import * as path from 'path';
const rootPath = path.resolve(__dirname, '../../');
// 默认配置
export const ConfigProd = {
    PORT: 3030,
    REDIS_CLIENT_ADDR: '47.110.155.99',
    REDIS_CLIENT_AUTH_PWD: 'root1219',
    SQL_NAME: 'super_y', // 使用哪个数据库
    SQL_USER: 'admin', // 用户名
    SQL_AUTH_PWD: 'admin1219', // 口令
    SQL_HOST: '47.110.155.99', // 主机名
    SQL_POOL_IDLE: 1000,
    SQL_POOL_MAX: 5,
    SQL_POOL_MIN: 0,
    SQL_PORT: 3306,
    PUSH_PATH: path.resolve(rootPath, 'public/s/'),
    STASH_PATH: path.resolve(rootPath, 'public/d/')
};
