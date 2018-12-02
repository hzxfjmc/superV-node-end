import { AbstractEngine } from '../abstract_engine';
// import * as jwtKoa from 'koa-jwt';

const secret = 'jwtSuperv';

export class JwtEngine extends AbstractEngine {
    constructor() {
        super();
    }

    public decorator(app) {
        // app.use(jwtKoa({secret}).unless({
        //     path: [/\/super_api\/user/]
        // }));
    }
}
