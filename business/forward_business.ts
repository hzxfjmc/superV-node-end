
import { SvrOption } from '../model/common/svr_context';
import { SvrName } from '../model/enums/svr_name';
import { ServicesProxy } from '../service/proxy/services_proxy';
export class ForwardBusiness {
    public async postRequest(ctx, sr, data = {}) {
        const opt = new SvrOption(ctx);
        opt.svrName = parseInt(SvrName[sr.toUpperCase()], 10);
        opt.formData = data;
        opt.url = data['fn'] || '';

        delete data['fn'];
        const result = await ServicesProxy.invokeRequest(ctx, opt);
        return result;
    }
}