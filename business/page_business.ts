import * as cheerio from 'cheerio';
import * as https from 'https';
import * as path from "path";
import * as fs from "fs";
import { SvrResponse } from "../model/common/svr_context";
import UuidHelper from '../helper/uuid_helper';
import MomentHelper from '../helper/moment_helper';
import Article from '../model/article';
const rootPath = path.resolve(__dirname, '../../');
const fileStore = process.env.NODE_ENV === 'development' ? 'D:\\file\\fileStore' : '/file/fileStore';
const pushFileOrigin = process.env.NODE_ENN === 'development' ? 'http://localhost:6060/fileStore' : 'http://localhost:6060/fileStore';
const sep = path.sep;

export class PageBusiness {

    public async createPage(ctx, formData) {
        const res = new SvrResponse();
        try {
            delete formData.id;
            const article = await Article.create(formData);
            res.display = '创建文章成功';
            res.content = article;
        } catch(e) {
            res.code = -1;
            res.display = `创建文章失败${e}`;
        }
        return res;
    }

    public async stashPage(ctx, formData) {
        const res = new SvrResponse();
        const {id} = formData;
        try {
            await Article.update(formData, {where: {id}});
        } catch(e) {
            res.code = -1;
            res.display = '文章存草稿失败';
        }
        return res;
    }

    public async checkArticleExist(id) {
        return await Article.findById(id);
    }


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

    public async upload(ctx, formData) {
        const res = new SvrResponse();
        const { files } = formData;
        const filesArr = [files];
        const date = MomentHelper.formatterDate(new Date(), 'YYYY-MM-DD');
        const dirPath = fileStore + `${sep}${date}${sep}`;
        const origin = pushFileOrigin + `/${date}/`;
        const filePathArr = [];
        await PageBusiness.createFolder(dirPath);
        try {
            for (let file of filesArr) {
                const reader = fs.createReadStream(file.path);
                let filePath = dirPath + file.name;
                const upStream = fs.createWriteStream(filePath);
                reader.pipe(upStream);
                filePathArr.push(origin + file.name);
            }

            res.display = '上传成功';
            res.content = filePathArr;
        } catch(e) {
            res.code = -1;
            res.display = `上传失败${e}`;
        }
        return res;
    }

    /**
     * @description 创建文件夹
     * @param dirpath
     * @param callback
     */
    private static createFolder(dirpath) {
        console.log(dirpath);
        if(fs.existsSync(dirpath)){
            return true;
        }else{
            if(PageBusiness.createFolder(path.dirname(dirpath))){
                fs.mkdirSync(dirpath);
                return true;
            }
        }
    }
}