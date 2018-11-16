import * as redis from 'redis';
import * as Redlock from 'redlock';
import { Core } from '../../core/core';
import { AbstractEngine } from '../abstract_engine';
import { RedisClient } from '../model/redis_client';

export class RedisEngine extends AbstractEngine {
    constructor() {
        super();
    }

    public decorator(app: Core) {
        const client = redis.createClient(
            app.config.redis.port,
            app.config.redis.addr,
            {
                password: app.config.redis.pass,
                prefix: app.config.name + ':'
            }
        );
        client.on('connect', () => {
            app.logger.info('【redis】 connected');
        });
        client.on('ready', () => {
            app.logger.info(`【redis】 ready`);
        });

        client.on('reconnect', () => {
            app.logger.info('【redis】 is reconnecting');
        });

        client.on('error', (err) => {
            app.logger.error('【redis】 encounters error: %j'+ (err.stack || err));
        });

        client.on('end', () => {
            app.logger.info('【redis】 connection ended');
        });

        app.redLock = this.redLockInit(client, app);

        app.redisClient = new RedisClient(client, app.config.redis);

    }

    /**
     * @description
     * 初始化 redis同步锁
     * @private
     * @param {any} client 
     * @returns 
     * @memberof RedisEngine
     */
    private redLockInit(client, app) {
        const redlock = new Redlock(
            // you should have one client for each independent redis node
            // or cluster
            [client],
            {
                // the expected clock drift; for more details
                // see http://redis.io/topics/distlock
                driftFactor: 0.01, // time in ms

                // the max number of times Redlock will attempt
                // to lock a resource before error
                retryCount: 10,

                // the time in ms between attempts
                retryDelay: 10, // time in ms

                // the max time in ms randomly added to retries
                // to improve performance under high contention
                // see https://www.awsarchitectureblog.com/2015/03/backoff.html
                retryJitter: 200 // time in ms
            }
        );
        redlock.on('clientError', (err) => {
            app.logger.error('Redlock clientError:', err);
        });
        return redlock;
    }
}