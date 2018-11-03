import { Core, CoreContext } from '../../core/core';
import UuidHelper from '../../helper/uuid_helper';
import { AbstractEngine } from '../abstract_engine';
import { Session } from '../model/session';

export class SessionEngine extends AbstractEngine {

    constructor() {
        super();
    }
    public decorator(app: Core) {
        app.keys = ['yyfax-cms'];
        const CONFIG = {
            key: app.config.name + '.sess', /** (string) cookie key (default is koa:sess) */
            cookie: {
                // maxAge: 1000, /** (number) maxAge in ms (default is 1 days) */
                overwrite: false, /** (boolean) can overwrite or not (default true) */
                httpOnly: true, /** (boolean) httpOnly or not (default true) */
                signed: true, /** (boolean) signed or not (default true) */
            }
        };

        app.use(async (ctx: CoreContext, next) => {
            let sess: Session;
            let sid;
            let json;
            ctx.cookieOption = CONFIG.cookie;
            ctx.sessionKey = CONFIG.key;
            ctx.sessionId = null;
            // 获取sessionID
            sid = ctx.cookies.get(CONFIG.key, ctx.cookieOption);
            // 获取session值
            if (sid) {
                try {
                    json = await app.redisClient.get(sid);
                } catch (e) {
                    ctx.app.logger.error('从缓存中读取session失败： %s\n', e);
                    json = null;
                }
            }

            // 实例化session
            if (json) {
                ctx.sessionId = sid;
                try {
                    sess = new Session(this, json);
                } catch (err) {
                    if (!(err instanceof SyntaxError)) {
                        throw err;
                    }
                    sess = new Session(this, null);
                }
            } else {
                sid = ctx['sessionId'] = sid || UuidHelper.gen();
                sess = new Session(this, null);
            }

            // 挂载session到上下文
            Object.defineProperty(ctx, 'session', {
                get() {
                    return sess;
                },
                set(val) {
                    if (null === val) {
                        return sess = null;
                    }
                    if ('object' === typeof val) {
                        return sess = new Session(this, val);
                    }
                    throw new Error('ctx.session can only be set as null or an object.');
                }
            });

            try {
                await next();
            } catch (err) {
                throw err;
            } finally {
                let jsonString = '';
                if (typeof json === 'object') {
                    jsonString = JSON.stringify(json);
                }
                if (undefined === sess) {
                    // 断言：这里不会进入
                } else if (null === sess) {
                    // 设置session=null 表示清空session
                    ctx.cookies.set(CONFIG.key, '', ctx.cookieOption);
                    // await app.redisClient.del(sid);
                } else if (!jsonString && !sess.length) {
                    // session 为空且此次操作不涉及sess修改
                } else if (sess.changed(jsonString)) {
                    // session变化
                    jsonString = sess.save();
                    await app.redisClient.set(sid, jsonString);
                    app.redisClient.ttl(sid);
                    // 设置redis值过期时间为30分钟
                    app.redisClient.expire(sid, 3600);
                } else {
                    // session 续期
                    app.redisClient.expire(sid, 3600);
                }
            }
        });
    }
}
