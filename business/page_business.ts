import * as cheerio from 'cheerio';
import * as https from 'https';
import * as path from "path";
import * as fs from "fs";
import { SvrResponse } from "../model/common/svr_context";
import UuidHelper from '../helper/uuid_helper';
const rootPath = path.resolve(__dirname, '../../');

export class PageBusiness {
    public async getHtmlByUrl(ctx, formData) {
        const url = formData.url || 'https://mp.weixin.qq.com/s/vjiFB8Xvj94CMKhQ9ENypw';

        https.get(url, (res) => {
            let html = '';
            res.on('data', (data) => {
                html += data;
            });
            res.on('end', async () => {
                const richContent = this.filterArticleDom(html);
                const res = await this.renderStringToFile(ctx, {richContent}, 'stash', {});
            });
        }).on('error', function() {
            console.log('获取数据出错！');
        });
    }

    private filterArticleDom(html) {
        const $ = cheerio.load(html);
        const richContentEl = $('#js_articlxe');
        richContentEl.find('img').filter((i, elem) => elem.attribs['data-src']).each((i, elem) => {
            elem.attribs.src = elem.attribs['data-src'];
        });
        richContentEl.find('img').each((i, elem) => {
            console.log(elem.attribs);
        });
        return html;
    }

    private async renderStringToFile (ctx, data, action, activity) {
        const result = new SvrResponse();
        const { pushPath, stashPath} = ctx.app.config.paths;
        let dirPath = stashPath;
        let fileName = UuidHelper.gen() + '.html';
        if (action === 'push') {
            dirPath = pushPath;
            fileName = data.id + '.html';
        }
        // const {id, html, value, cssPaths, jsPaths, config, ...restData} = data;
        // config.id = id;
        // const templatePath = path.resolve(rootPath, 'views/template1.pug');
        // const htmlStr = pug.renderFile(templatePath, {htmlInner: html, cssPaths, jsPaths, config});
        return new Promise((resolve, reject) => {
            fs.writeFile(`${dirPath}/${fileName}`, data.richContent, async (err) => {
                if (!err) {
                    const url = this.handlePath(ctx, fileName, action, activity);
                    result.content = url;
                    resolve(result);
                } else {
                    result.code = -1;
                    result.display = '生成html失败';
                    reject(result);
                }
            });
        });
    }

    /**
     * @description 处理生成文件到访问地址
     * @author huangjfc
     * @param ctx
     * @param fileName
     * @param action
     * @param activity
     * @returns {}
     */
    private handlePath(ctx, fileName, action, activity) {
        const referer = ctx.req.headers.referer;
        const origin = ctx.app.config.deployOrigin;

        let url = '';
        if (process.env.NODE_ENV === 'production') {
            url = action === 'push' ? `${origin}/s/${fileName}` : `${referer}d/${fileName}`;
        } else {
            url = action === 'push' ? `${referer}s/${fileName}` : `${referer}d/${fileName}`;
        }
        return action === 'push' ? {activityPageUrl: url} : {stashPageUrl: url};
    }
}