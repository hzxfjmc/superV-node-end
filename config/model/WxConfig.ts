/**
 * @description 微信配置
 * @author cairc
 * @export
 * @class WxConfig
 */
export class WxConfig {
    constructor(id, secret) {
        this.wxAppId = id;
        this.wxAppSecret = secret;
    }
    public wxAppId: string;
    public wxAppSecret: string;
}