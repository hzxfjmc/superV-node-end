import { SvrOption } from '../model/common/svr_context';
import * as Enum from '../model/enums/index';
import { ServicesProxy } from '../service/proxy/services_proxy';

/**
 * @description 转发用户模块的接口
 * @author huangjfc
 * @export
 * @class UserBusiness
 */
export class UserBusiness {
    /**
     * @description 获取商户列表
     * @author huangjfc
     * @param ctx
     * @param data
     * @returns {Promise<any>}
     */
    public async queryStoreList(ctx, data) {
        return await this.commonRequest(ctx, {...data, state: 1}, {url: '/api/channel_config/queryList'});
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
        option.svrName = Enum.SvrName.USER;
        option.formData = data;
        const res = await ServicesProxy.invokeRequest(ctx, option);
        return res;
    }
}
