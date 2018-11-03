import { AbstractEngine } from '../abstract_engine';

export class ErrorEngine extends AbstractEngine {
    constructor() {
        super();
    }
    public decorator(app) {
        app.use(async (ctx, next) => {
            try {
                await next();

                const setBody = async (ctx, body) => {
                    ctx.body = body;
                };

                if (ctx.status === 403) {
                    ctx.status = 403;
                    await setBody(this, ctx.response.body || { msg: '未认证', code: 403 });
                } else if (ctx.status === 404) {
                    ctx.status = 404;
                    await setBody(this, ctx.response.body || { msg: 'Method Not Found', code: 404 });
                } else if (ctx.status === 500) {
                    ctx.status = 500;
                    await setBody(this, ctx.response.body || { msg: 'Service Error', code: 500 });
                } else if (ctx.status === 429) {
                    ctx.status = 429;
                    await setBody(this, ctx.response.body || { msg: '访问人数太多,请稍后访问', code: 429 });
                }
            } catch (err) {

                app.logger.error(err);
                // some errors will have .status
                // however this is not a guarantee
                ctx.status = err.status || 500;

                if (ctx.status === 403) {
                    ctx.body = 'request unauthorized';
                } else if (ctx.status === 404) {
                    ctx.body = 'request not found';
                } else if (ctx.status === 500) {
                    ctx.body = 'server error';
                } else {
                    ctx.body = err;
                }
                // since we handled this manually we'll
                // want to delegate to the regular app
                // level error handling as well so that
                // centralized still functions correctly.
                app.emit('error', err, this);
            }
        });

        // error handler
        app.on('error', (err, ctx) => {
            app.logger.error(`[异常退出]${err.stack}`);
        });
    }
}
