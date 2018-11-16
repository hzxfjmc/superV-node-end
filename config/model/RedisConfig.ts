/**
 * @description redis配置
 * @author cairc
 * @export
 * @class RedisConfig
 */
export class RedisConfig {
    constructor(addr, pass, port = 6379, name = 'super') {
        this.port = port;
        this.addr = addr;
        this.name = name;
        this.pass = pass;
    }
    /**
     * @description 文件前缀
     * @type {string}
     * @memberof RedisConfig
     */
    public name: string;
    /**
     * @description redis服务器地址
     * @type {string}
     * @memberof RedisConfig
     */
    public addr: string;
    /**
     * @description 端口号
     * @type {string}
     * @memberof RedisConfig
     */
    public port: number;
    /**
     * @description 密码
     * @type {string}
     * @memberof RedisConfig
     */
    public pass: string;
}