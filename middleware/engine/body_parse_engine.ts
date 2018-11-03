import * as bodyParser from 'koa-body';
import { AbstractEngine } from '../abstract_engine';

export class BodyParseEngine extends AbstractEngine {
    constructor() {
        super();
    }

    public decorator(app) {
        app.use(bodyParser({
            multipart: true,
            textLimit: '5mb',
            jsonLimit: '5mb',
            onError: (err, ctx) => {
                console.log(err);
                ctx.throw('body parse error', 422);
            }
        }));
    }
}
