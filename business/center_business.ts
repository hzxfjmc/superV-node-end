import { SvrOption } from '../model/common/svr_context';
import * as Enum from '../model/enums/index';
import { ServicesProxy } from '../service/proxy/services_proxy';

/**
 * @description 转发console-center的接口
 * @author huangjfc
 * @export
 * @class CenterBusiness
 */
export class CenterBusiness {
    /**
     * @description 获取所有用户
     * @author huangjfc
     * @param ctx
     * @param data
     * @returns {Promise<any>}
     */
    public async queryAllUser(ctx, data) {
        return await this.commonRequest(ctx, data, {url: '/console/sys/user/query_all_user'});
    }

    /**
     * @description 获取用户权限
     * @author huangjfc
     * @param ctx
     * @param data
     * @returns {Promise<any>}
     */
    public async role(ctx, data) {
        return await this.commonRequest(ctx, data, {url: '/console/sys/user/role'});
    }

    /**
     * @description 判断是否登录
     * @author huangjfc
     * @param ctx
     * @param data
     * @returns {Promise<any>}
     */
    public async isLogin(ctx, data) {
        const res = await this.commonRequest(ctx, data, {url: '/console/admin/islogin'});
        ctx.userInfo = res.code === 0 ? res.content : {};
        return res;
    }

    /**
     * @description 退出登录
     * @author huangjfc
     * @param ctx
     * @param data
     * @returns {Promise<any>}
     */
    public async logout(ctx, data) {
        return await this.commonRequest(ctx, data, {url: '/console/admin/logout'});
    }

    /**
     * @description 获取部门列表
     * @author huangjfc
     * @param ctx
     * @param data
     * @returns {Promise<any>}
     */
    public async tree(ctx, data) {
        return await this.commonRequest(ctx, data, {url: '/console/sys/org/tree'});
    }

    /**
     * @description 查询用户信息
     * @author huangjfc
     * @param ctx
     * @param data
     * @returns {Promise<any>}
     */
    public async queryUser(ctx, data) {
        return await this.commonRequest(ctx, data, {url: '/console/sys/user/query_user'});
    }

    /**
     * @description 上传文件
     * @author huangjfc
     * @param ctx
     * @param data
     * @returns {Promise<any>}
     */
    public async uploadImg(ctx, data) {
        return await this.commonRequest(ctx, data, {url: '/console/sys/upload/img'});
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
        option.svrName = Enum.SvrName.CONSOLE_CENTER;
        option.formData = data;
        option.needFilterLog = true;
        return await ServicesProxy.invokeRequest(ctx, option);
    }
}
