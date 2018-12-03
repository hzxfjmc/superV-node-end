
import { CoreContext } from '../../core/core';

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
