/* tslint:disable */
import * as redis from 'redis';
import { RedisConfig } from '../../config/model/RedisConfig';

/**
 * @description redis 异步封装类
 * @author cairc
 * @class RedisClient
 */
export class RedisClient {
    public client: redis.RedisClient;
    public redisConfig: RedisConfig;
    constructor(client, redisConfig) {
        this.client = client;
        this.redisConfig = redisConfig;
    }

    /**
     * @description 获取redis值
     * @author cairc
     * @param {*} key
     * @returns
     * @memberof RedisClient
     */
    public get(key: string) {
        return new Promise((resolve, reject) => {
            // 去掉前缀
            key = key.replace(new RegExp(`^${this.redisConfig.name}:`), '');
            this.client.get(key, function (err, data) {
                if (err) {
                    reject();
                    return;
                }
                if (data) {
                    const parseData = JSON.parse(data || '{}');
                    resolve(parseData);
                }
                else {
                    resolve('');
                }
            })
        })
    }

    /**
     * @description
     * 设置缓存
     * @author lizc
     * @param {string} key 
     * @param {string} value 
     * @param {number} [expire] 
     * @returns 
     * @memberof RedisClient
     */
    public set(key: string, value: string, expire?: number) {
        const self = this;
        return new Promise((resolve, reject) => {
            this.client.set(key, value, function (err, data) {
                if (err) {
                    reject();
                    return;
                }
                if (expire) {
                    self.expire(key, expire);
                }
                resolve(data);
            });
        })
    }
    /**
     * @description
     * 删除缓存
     * @author lizc
     * @param {any} args 
     * @returns 
     * @memberof RedisClient
     */
    public del(...args) {
        return new Promise((resolve, reject) => {
            this.client.del(...args, function (err, data) {
                if (err) {
                    reject();
                    return;
                }
                resolve(data);
            })
        })
    }

    /**
     * @description
     * 设置过期时间
     * @author lizc
     * @param {string} key 
     * @param {number} seconds 
     * @returns 
     * @memberof RedisClient
     */
    public expire(key: string, seconds: number) {
        return new Promise((resolve, reject) => {
            this.client.expire(key, seconds, function (err, data) {
                if (err) {
                    reject();
                    return;
                }
                resolve(data);
            });
        })
    }

    /**
     * @description
     * 设置ttl
     * @author lizc
     * @param {string} key 
     * @returns 
     * @memberof RedisClient
     */
    public ttl(key: string) {
        return new Promise((resolve, reject) => {
            this.client.PTTL(key, function (err, data) {
                if (err) {
                    reject();
                    return;
                }
                resolve(data);
            });
        })
    }

    /**
     * @description
     * 获取keys
     * @author lizc
     * @param {string} key 
     * @returns 
     * @memberof RedisClient
     */
    public keys(key: string) {
        return new Promise((resolve, reject) => {
            this.client.keys(`${this.redisConfig.name}:${key}`, function (err, data) {
                if (err) {
                    reject();
                    return;
                }
                resolve(data);
            });
        })
    }

}