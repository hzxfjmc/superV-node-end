
import { AbstractEngine } from '../abstract_engine';

/**
 * @description 验证过来的请求是否符合要求并对请求参数进一步处理
 * @author cairc
 * @export
 * @class RequestFilterEngine
 * @extends {AbstractEngine}
 */
export class RequestFilterEngine extends AbstractEngine {
    constructor() {
        super();
    }

    public decorator(app) {

        app.use(async (ctx, next) => {
            const body: any = ctx.request.body || {};

            if (body.params) {
                const params = body.params;
                delete params['_auth'];
                ctx.request.body = params;
            }

            // 获取用户id
            // const userAuthInfo = { userId: ''};
            // if (body.ext) {
            //     userAuthInfo.userId = body.ext.userId;
            // } else if (body.params && body.params.userId) {
            //     userAuthInfo.userId = body.params.userId || '';
            // }
            //
            // ctx.userAuthInfo = userAuthInfo;
            await next();

        });
    }
}
