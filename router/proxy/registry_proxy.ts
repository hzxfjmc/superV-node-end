
import { RegistryFacade } from '../../service/facade/registry_facade';
import { AbstractRouterProxy } from './abstract_router_proxy';

export class RegistryProxy extends AbstractRouterProxy {
    private servicesFacade: RegistryFacade;
    constructor(app) {
        super(app);
        this.servicesFacade = new RegistryFacade();
        this.router.prefix(app.config.apiPrefix);
    }
    public initRouter() {

        const sv = this.servicesFacade;
        this.router.all('/:sys/:fn', async (ctx, next) => {
            await sv.handleReq(ctx);
        });
    }
}