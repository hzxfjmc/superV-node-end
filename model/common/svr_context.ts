
import { CoreContext } from '../../core/core';
import { SvrName, Terminal } from '../enums/index';

export class SvrOption {
    private ctx: CoreContext;
    constructor(ctx) {
        this.ctx = ctx;
    }
    /**
     * 请求网址
     *
     * @type {string}
     * @memberOf SvrOption
     */
    public url: string;
    /**
     * 微服务枚举值
     *
     * @type {SvrName}
     * @memberOf SvrOption
     */
    public svrName: SvrName;
    /**
     * 表单数据
     *
     * @type {{}}
     * @memberOf SvrOption
     */
    public formData: {};

    /**
     * 渠道ＩＤ
     *
     * @type {string}
     * @memberOf SvrOption
     */
    public channelId: string;

    /**
     * 是否需要过滤的Log
     */
    public needFilterLog: boolean;

    /**
     * 根据微服务名称获取对应服务网址
     *
     * @readonly
     * @type {string}
     * @memberOf SvrOption
     */
    public get svrUrl(): string {
        const name = SvrName[this.svrName];
        return this.ctx.app.config.msvUrl[name] || '';
    }
}
export class SvrResponse {

    constructor(code = 0, msg = '', display = '', content = null, status = 200) {
        this.code = code || 0;
        this.message = msg || '';
        this.display = display || '';
        this.content = content || {};
        this.status = status || 200;
        this.time = Date.now();
    }
    /**
     * 后台返回状态码
     *
     * @type {number}
     * @memberOf SvrResponse
     */
    public code: number;

    /**
     * 后台返回信息
     *
     * @type {string}
     * @memberOf SvrResponse
     */
    public message: string;

    /**
     * 后台返回供前台显示信息
     *
     * @type {string}
     * @memberOf SvrResponse
     */
    public display: string;

    /**
     * 后台返回正文
     *
     * @type {Object}
     * @memberOf SvrResponse
     */
    public content: {};

    /**
     * 网络状态码(200:sucess)
     *
     * @type {number}
     * @memberOf SvrResponse
     */
    public status: number;
    /**
     * @description
     * 服务器时间
     * @type {string}
     * @memberof SvrResponse
     */
    public time: number;
}
export class SvrRequest {
    constructor(ctx) {
        const originalBody = ctx.request.originalBody || {};
        this.imei = originalBody.imei;
        this.token = originalBody.token;
        this.mid = originalBody.mid;
        this.ts = originalBody.ts;
        this.ua = originalBody.ua;
        this.terminal = originalBody.terminal;
        this.channelId = originalBody.channelId;
        this.sign = '';
        this.gps = '';
        this.ver = '';
        this.ip = originalBody.ip;
        this.Ext = ctx;
    }
    // private getRealIp(ctx): string {
    //     const req = ctx.request;
    //     let ip: string = req.get('X-Forwarded-For') || req.get('Proxy-Client-IP') || req.get('X-Real-IP');
    //     ip = ip || ctx.request.originalBody.ip;

    //     // 根据网卡获取本机IP
    //     if (!ip || /(127.0.0.1$)|(::1)/.test(ip)) {
    //         let ipTable = '';
    //         const ifaces = os.networkInterfaces();
    //         // 取第一个IP
    //         // tslint:disable-next-line:forin
    //         for (const dev in ifaces) {
    //             ifaces[dev].forEach((details, alias) => {
    //                 if (details.family === 'IPv4') {
    //                     ipTable = details.address;
    //                     return;
    //                 }
    //             });
    //             if (ipTable) {
    //                 ip = ipTable;
    //                 break;
    //             }
    //         }
    //     }

    //     return ip;
    // }
    /**
     * @description 设置etx
     * @author lizcd
     * @private
     * @param {any} ctx
     * @returns
     * @memberof SvrRequest
     */
    private set Ext(ctx) {
        const token: string = ctx.userAuthInfo && ctx.userAuthInfo.token || '';
        const userId: string = (ctx.userAuthInfo && ctx.userAuthInfo.userId) || '';
        this.ext = {
            token,
            userId
        };
    }
    /**
     * 终端id
     *
     *
     * @memberOf SvrRequest
     */
    public imei: string;
    /**
     * 登录令牌
     *
     *
     * @memberOf SvrRequest
     */
    public token: string;
    /**
     * mid
     *
     * @type {string}
     * @memberOf SvrRequest
     */
    public mid: string;
    /**
     * ip地址
     *
     *
     * @memberOf SvrRequest
     */
    public ip: string;
    /**
     * 时间戳
     *
     *
     * @memberOf SvrRequest
     */
    public ts: number;
    /**
     * 签名
     *
     *
     * @memberOf SvrRequest
     */
    public sign: string;
    /**
     * 用户代理 UserAgent
     *
     *
     * @memberOf SvrRequest
     */
    public ua: string;
    /**
     * 终端 iOS、Android、H5、PC
     *
     *
     * @memberOf SvrRequest
     */
    public terminal: Terminal;
    /**
     * 逗号分隔经纬度
     *
     *
     * @memberOf SvrRequest
     */
    public gps: string;
    /**
     * 版本号
     *
     *
     * @memberOf SvrRequest
     */
    public ver: string;
    /**
     * 渠道编号
     *
     *
     * @memberOf SvrRequest
     */
    public channelId: string;
    /**
     * 业务参数封装
     *
     *
     * @memberOf SvrRequest
     */
    public params;
    /**
     * 扩展内容
     *
     * @type {{
     *         token:string
     *         userId:string
     *     }}
     * @memberof SvrRequest
     */
    public ext: {
        token: string,
        userId: string
    };
}
