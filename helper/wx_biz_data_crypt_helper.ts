import * as crypto from 'crypto';

export default class WXBizDataCryptHelper {
    /**
     * @description 微信用户数据解密
     * @author cairc
     * @static
     * @param {any} appId
     * @param {any} sessionKey
     * @param {any} encryptedData
     * @param {any} iv
     * @memberof WXBizDataCryptHelper
     */
    public static decryptData(appId, sessionKey, encryptedData, iv) {
        // base64 decode
        sessionKey = new Buffer(sessionKey, 'base64');
        encryptedData = new Buffer(encryptedData, 'base64');
        iv = new Buffer(iv, 'base64');
        let decodedObj = { watermark: { appid: '' } };
        let decoded = '';

        try {
            // 解密
            const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);
            // 设置自动 padding 为 true，删除填充补位
            decipher.setAutoPadding(true);
            decoded = decipher.update(encryptedData, 'binary', 'utf8');
            decoded += decipher.final('utf8');

            decodedObj = JSON.parse(decoded);

        } catch (err) {
            throw new Error('Illegal Buffer');
        }

        if (decodedObj.watermark.appid !== appId) {
            throw new Error('Illegal appId')
        }

        return decoded;

    }
}
