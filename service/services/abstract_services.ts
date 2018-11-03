
import { ForwardBusiness } from '../../business/forward_business';
import { SvrResponse } from '../../model/common/svr_context';

export abstract class AbstractServices {
    public name: string;
    public forward: ForwardBusiness;
    /**
     * 过滤user-agent为空的请求
     *
     * @type {boolean}
     * @memberof AbstractServices
     */
    public filterUAEmptyRequest: boolean = true;
    constructor() {
        this.forward = new ForwardBusiness();
    }
    private invokeServiceMethod(type) {
        return async (ctx, formData, fn) => {
            if (type !== 'ALL') {
                if (type !== ctx.request.method) {
                    const res = new SvrResponse();
                    res.status = 404;
                    res.code = -1;
                    res.display = '方法不存在';
                    return res;
                }
            }

            formData['fn'] = fn;
            const res = await this.forward.postRequest(ctx, this.name, formData);
            return res;
        };
    }
    public genMethod(funs) {
        if (funs.ALL) {
            for (const item of funs.ALL) {
                this[item] = this.invokeServiceMethod('ALL');
            }
        }
        if (funs.GET) {
            for (const item of funs.GET) {
                this[item] = this.invokeServiceMethod('GET');
            }
        }
        if (funs.POST) {
            for (const item of funs.POST) {
                this[item] = this.invokeServiceMethod('POST');
            }
        }
    }

    /**
     * 是否过滤userAgent为空请求
     *
     * @returns boolean
     *
     * @memberof AbstractServices
     */
    public isFilterUAEmptyRequest() {
        return this.filterUAEmptyRequest;
    }
}