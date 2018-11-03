
import { AbstractRouterProxy } from './proxy/abstract_router_proxy';
import { RegistryProxy } from './proxy/registry_proxy';

/**
 * 路由服务
 *
 * @class RouterService
 */
class RouterService {
    public routes: Array<AbstractRouterProxy>;
    constructor(app) {
        this.routes = new Array<AbstractRouterProxy>();

        // ajax路由处理
        const registryRoute = new RegistryProxy(app);
        registryRoute.initRouter();
        this.routes.push(registryRoute);

    }
    /**
     * 配置路由
     *
     * @param {any} app
     */
    public configRouter(app) {
        for (const route of this.routes) {
            app.use(route.router.routes(), route.router.allowedMethods());
        }
    }
}

export class RouterHelper {

    public static createRouter(app) {
        const routerSer = new RouterService(app);
        return routerSer;
    }
}