//
// import * as request from 'request-promise-native';
// import { SvrOption, SvrResponse } from '../../model/common/svr_context';
//
// /**
//  * ServicesProxy 服务代理类，将请求转发到后台
//  */
// export class ServicesProxy {
//     /**
//      * 生成请求参数
//      *
//      * @static
//      * @param {any} ctx
//      * @param {SvrOption} options
//      * @returns
//      *
//      * @memberOf ServicesProxy
//      */
//     public static genReqOpts(ctx, options: SvrOption) {
//         // const svrReq = new SvrRequest(ctx);
//
//         // 头部认证数据
//         const headers = new Object();
//         headers['user-agent'] = svrReq.ua;
//         headers['content-type'] = 'application/json';
//         headers['cookie'] = ctx.headers.cookie;
//
//         const reqOpt = {
//             uri: options.url,
//             // baseUrl: options.svrUrl,
//             method: 'POST',
//             headers,
//             json: true,
//             body: null,
//             resolveWithFullResponse: true
//         };
//
//         reqOpt.body = {
//             ...svrReq,
//             ...{
//                 params: options.formData || {}
//             }
//         };
//
//         return reqOpt;
//
//     }
//
//     public static recordResLog(ctx, reqOpts, resJSON, options) {
//         if (process.env.NODE_ENV === 'production' && options.needFilterLog) {
//             const res = {...resJSON, body: {...resJSON.body, content: '+'}};
//             ctx.app.logger.warn('【请求日志】:' + resJSON.body.display + '\n【参数】:' + JSON.stringify(reqOpts) + '\n 【正文】:' + JSON.stringify(res));
//         } else {
//             ctx.app.logger.warn('【请求日志】:' + resJSON.body.display + '\n【参数】:' + JSON.stringify(reqOpts) + '\n 【正文】:' + JSON.stringify(resJSON));
//         }
//     }
//
//     /**
//      * 发起外部请求
//      *
//      * @static
//      * @param {any} ctx
//      * @param {SvrOption} options
//      * @returns
//      *
//      * @memberOf ServicesProxy
//      */
//     public static async invokeRequest(ctx, options: SvrOption) {
//         const reqOpts = ServicesProxy.genReqOpts(ctx, options);
//         let response: any = null;
//         let res: any = null;
//
//         try {
//             response = await ServicesProxy.request(ctx, reqOpts);
//             res = ServicesProxy._handleResponse(ctx, options, reqOpts, response);
//         } catch (ex) {
//             ctx.app.logger.error('【服务没响应】:\n 【参数】:' + JSON.stringify(reqOpts) + '\n 【正文】:' + ex.stack);
//             res = new SvrResponse();
//             res.code = -1;
//             res.status = 500;
//             res.display = '服务好像有点问题,请稍后再来!';
//         }
//
//         return res;
//     }
//
//     /**
//      * @description 处理返回报文 official直接返回。
//      * @author cairc
//      * @static
//      * @param {any} ctx
//      * @param {SvrOption} options
//      * @param {any} reqOpts 请求参数
//      * @param {any} response 响应报文
//      * @returns
//      * @memberof ServicesProxy
//      */
//     public static _handleResponse(ctx, options: any, reqOpts, response) {
//         let res: any;
//         const resJSON = response.toJSON();
//         if (resJSON.statusCode === 200) {
//             res = new SvrResponse();
//             res.code = resJSON.body.code;
//             res.display = resJSON.body.display;
//             res.message = resJSON.body.message;
//             res.content = resJSON.body.content;
//             ServicesProxy.recordResLog(ctx, reqOpts, resJSON, options);
//         } else {
//             res = new SvrResponse();
//             res.code = -1;
//             res.status = resJSON.statusCode;
//             res.display = '服务返回异常';
//             ctx.app.logger.error('【服务返回异常】:\n 【参数】:' + JSON.stringify(reqOpts) + '\n 【正文】:' + JSON.stringify(resJSON));
//         }
//         return res;
//     }
//
//     /**
//      * 往微服务发送请求
//      *
//      * @static
//      * @param {any} ctx
//      * @param {any} reqOpts
//      * @returns
//      *
//      * @memberOf ServicesProxy
//      */
//     private static async request(ctx, reqOpts) {
//         const response = await request(reqOpts);
//         return response;
//     }
// }
