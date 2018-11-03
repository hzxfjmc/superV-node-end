// https://github.com/alexmingoia/koa-router
import { RouterHelper } from '../../router/router_helper';
import { AbstractEngine } from '../abstract_engine';

export class RouterEngine extends AbstractEngine {
    constructor() {
        super();
    }
    public decorator(app) {
        // 注册服务
        const router = RouterHelper.createRouter(app);
        router.configRouter(app);
    }
}
