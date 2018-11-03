import { AbstractServices } from '../abstract_services';

export class ForwardServices extends AbstractServices {
    constructor() {
        super();
        this.name = 'forward';
    }

    public async HandleRequest(ctx, sr, data) {
        const res = await this.forward.postRequest(ctx, sr, data);
        return res;
    }
    public async handleRequest(ctx, sr, data) {
        const self = this;
        const result = await self.HandleRequest(ctx, sr, data);
        return result;
    }
}