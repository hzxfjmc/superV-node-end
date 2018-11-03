import { DBConfigPool } from "./DBConfigPool";
/**
 * @description 数据库配置
 * @author cairc
 * @class DBConfig
 */
export class DBConfig {
    /**
     * @description 数据库地址
     * @type {string}
     * @memberof DBConfig
     */
    public host: string;
    constructor(host, port = 3306, name, username, password, encryptKey) {
        this.host = host;
        this.port = port;
        this.name = name;
        this.username = username;
        this.password = password;
        this.encryptKey = encryptKey;
    }
    /**
     * @description 端口号
     * @type {string}
     * @memberof DBConfig
     */
    public port: number;
    public name: string;
    public username: string;
    public password: string;
    public encryptKey: string;
    public pool: DBConfigPool;
}
