import { SvrOption } from '../model/common/svr_context';
import * as Enum from '../model/enums/index';
import { ServicesProxy } from '../service/proxy/services_proxy';

/**
 * @description 转发console-product的接口
 * @author huangjfc
 * @export
 * @class ProductBusiness
 */
export class ProductBusiness {
    /**
     * @description 获取YY计划类型列表
     * @author huangjfc
     * @param ctx
     * @param data
     * @returns {Promise<any>}
     */
    public async queryStoreList(ctx, data) {
        return await this.commonRequest(ctx, data, {url: '/plan/type/available/query/list'});
    }

    /**
     * @description 接口的统一处理
     * @author huangjfc
     * @param ctx
     * @param data
     * @param {any} url
     * @returns {Promise<any>}
     */
    private async commonRequest(ctx, data, {url}) {
        const option = new SvrOption(ctx);
        option.url = url;
        option.svrName = Enum.SvrName.CONSOLE_PRODUCT;
        option.formData = data;
        const res = await ServicesProxy.invokeRequest(ctx, option);
        return res;
    }
}
