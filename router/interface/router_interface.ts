import * as KoaRouter from 'koa-router';

export interface IRouterInterface {
    // routeStrage(KoaRouter): void;
    router: KoaRouter;
    initRouter(): void;
}