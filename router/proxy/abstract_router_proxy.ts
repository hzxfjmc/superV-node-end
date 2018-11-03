
import * as KoaRouter from 'koa-router';

export abstract class AbstractRouterProxy {

    public router: KoaRouter;
    constructor(app) {
        this.router = new KoaRouter();
        // this.initRouter();
    }

    public abstract initRouter()
}