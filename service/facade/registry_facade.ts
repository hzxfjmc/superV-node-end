import 'reflect-metadata';
import { CoreContext } from '../../core/core';
import { ReqMethod } from '../../model/enums/req_method';
import { RegisterFactory } from '../factory/register_factory';
import { AbstractServices } from '../services/abstract_services';
import UtilHelper from '../../helper/util_helper';

/**
 * RegistryFacade 客户端请求处理类
 */
export class RegistryFacade {
    private serFactory: RegisterFactory;

    constructor() {
        this.serFactory = new RegisterFactory();
    }

    /**
     * 处理请求
     *
     * @param {any} ctx 上下文
     */
    public async handleReq(ctx) {
        let res;
        const sys = ctx.params.sys;
        if (sys) {
            res = await this.handleRequest(ctx, ctx.params.sys);
        }
        if (res) {

            if (ctx.app.config.env !== 'production') {
                ctx.app.logger.info(`请求地址: ${ctx.request.href} 输出报文：${JSON.stringify(res)}`);
            }

            ctx.status = 'number' === typeof res.status ? res.status : 200;
            delete res.status;
            if (ctx.status === 404) {
                ctx.body = 'Method Not Found';
            } else {
                ctx.body = res;
            }
        } else {
            ctx.status = 404;
            ctx.body = 'Method Not Found';
        }

        return;
    }

    /**
     * 根据服务名称转发请求转发请求
     *
     * @param {any} ctx 上下文
     * @param {string} sr 服务名称
     * @returns
     *
     * @memberOf RegistryFacade
     */
    private async handleRequest(ctx: CoreContext, sr) {
        const fn = ctx.params.fn;
        if (!fn) {
            return { status: 404 };
        }

        const ser: AbstractServices = this.serFactory.getService(sr);
        if (ser === undefined || ser === null || !ser[fn]) {
            return { status: 404 };
        }

        const method = Reflect.getOwnMetadata('method', ser[fn]) || ReqMethod.POST;
        const permission = Reflect.getOwnMetadata('PERMISSION_METADATA', ser[fn]);

        let params = {};
        if (method !== ReqMethod[ctx.req.method]) {
            return { status: 404 };
        }
        if (permission) {
            const res = await this.handlePermission(ctx, permission);
            if (res.code !== 0) {
                return res;
            }
        }

        if (method === ReqMethod.POST) {
            params = ctx.request.files ? ctx.request.files : ctx.request.body;
        } else {
            params = ctx.query;
        }

        delete params['_csrf'];

        // 命中服务，调用服务方法
        return ser[fn].call(ser, ctx, params, fn);

    }

    /**
     * @description 处理接口权限
     * @param ctx
     * @param permission
     * @returns {Promise<any>}
     */
    private async handlePermission(ctx, permission) {
        // if (process.env.NODE_ENV === 'development') {
        //     return {code: 0, status: 200};
        // }
        const user = await this.serFactory.getService('center').isLogin(ctx, {});
        ctx.userInfo = user.content;
        if (user.code === 0) {
            const res = await this.serFactory.getService('center').role(ctx, {});
            if (res.code !== 0) {
                return res;
            }
            let permissionMap = UtilHelper.formatterRole(res);
            const permissionArr = permission.split('_');
            for (let i = 0; i < permissionArr.length; i++) {
                if (permissionMap) {
                    permissionMap = permissionMap[permissionArr[i]];
                } else {
                    break;
                }
            }
            return permissionMap ? {code: 0, status: 200} : {code: 100006, status: 200, display: '没权限访问'};
        } else {
            return {code: 100005, status: 200};
        }
    }
}
