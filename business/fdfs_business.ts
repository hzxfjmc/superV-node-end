import * as fs from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';
/**
 * @description fastdfs接口
 * @author huangjfc
 * @export
 * @class FdfsBusiness
 */
export class FdfsBusiness {

    /**
     * @description 单文件上传
     * @author huangjfc
     * @param ctx
     * @param formData
     */
    public async uploadSingle(ctx, formData) {
        let stream = null;
        if (!formData.buffer) {
            stream = fs.readFileSync(formData.path);
            delete formData.path;
        } else {
            stream = Buffer.from(formData.buffer.toString());
        }
        return ctx.app.fdfs.upload(stream, formData).then(fileId => {
            return {fileId: fileId || formData.fileId};
        }).catch(err => {
            return {display: `文件上传失败${err}`};
        });
    }

    /**
     * @description 返回不带token的地址
     * @param {string} fileId
     * @returns {string}
     */
    public calcUrl(fileId: string, urlPrefix) {
        if (urlPrefix[urlPrefix.length - 1] === '/') {
            return urlPrefix + fileId;
        }else{
            return urlPrefix + '/' + fileId;
        }
    }

    /**
     * @description 返回带token的文件地址
     * @param {string} fileId
     * @returns {string}
     */
    private calcTokenUrl(fileId: string, ctx) {
        const {urlPrefix, secretKey } = ctx.app.config;
        const idx = fileId.indexOf('/');
        const group = fileId.substring(0, idx);
        fileId = fileId.substring(idx + 1);
        const ts = (new Date().getTime() / 1000).toFixed();
        const token = this.getToken(fileId, ts, secretKey);
        if (urlPrefix[urlPrefix.length - 1] === '/') {
            return urlPrefix + group + '/' + fileId + '?token=' + token + '&ts=' + ts;
        }else{
            return urlPrefix + '/' + group + '/' + fileId + '?token=' + token + '&ts=' + ts;
        }
    }

    /**
     * @description fastdfs加密
     * @param fileId
     * @param ts
     * @param secretKey
     * @returns {string}
     */
    private getToken(fileId, ts, secretKey) {
        const md = crypto.createHash('md5');
        const str = fileId + secretKey + ts;
        md.update(str);
        return md.digest('hex');
    }

    /**
     * @description fastdfs 文件删除
     * @param ctx
     * @param fileId
     */
    public delFile(ctx, fileId) {
        ctx.app.fdfs.del(fileId).then(() => {
            // 删除成功
            ctx.app.logger.info('删除文件成功: \n 【参数】' + fileId);
        }).catch(err => {
            ctx.app.logger.error('删除文件失败: \n 【参数】' + fileId + '\n 【正文】' + err);
        });
    }
}
