import * as cheerio from 'cheerio';
import * as https from 'https';
import * as path from "path";
import * as fs from "fs";
import {Op} from 'sequelize';
import { SvrResponse } from "../model/common/svr_context";
import UuidHelper from '../helper/uuid_helper';
import MomentHelper from '../helper/moment_helper';
import Article from '../model/article';
import ArticleFolder from '../model/article_folder';
import UserCollect from '../model/user_collect';
import Paging from "../helper/paging";
import * as Enum from '../model/enums';
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

    public async pushPage(ctx, formData) {
        const res = new SvrResponse();
        const {id, isPublic} = formData;
        formData.status = isPublic ? Enum.ArticleStatus.PUBLIC : Enum.ArticleStatus.UNPUBLIC;
        try {
            await Article.update(formData, {where: {id}});
            res.display = '文章发布成功';
        } catch(e) {
            res.code = -1;
            res.display = '文章发布失败';
        }
        return res;
    }

    public async checkArticleExist(id) {
        return await Article.findOne({
            where: {
                id
            },
            raw: true
        });
    }

    // 一键导入
    public async getHtmlByUrl(ctx, formData) {
        const url = formData.url || 'https://mp.weixin.qq.com/s/vjiFB8Xvj94CMKhQ9ENypw';
        // const option={
        //     path: url,
        //     headers:{
        //         'Host':'mp.weixin.qq.com',
        //         'Referer':'https://mp.weixin.qq.com/s/vjiFB8Xvj94CMKhQ9ENypw?'
        //     }
        // };
        https.get(url, (res) => {
            let html = '';
            res.on('data', (data) => {
                html += data;
            });
            res.on('end', async () => {
                const config = this.filterArticleDom(html);
                config.channelUrl = url;
                config.userId = 1;
                // const res = await this.renderStringToFile(ctx, {richContent}, 'stash', {});
                await this.createPage(ctx, config);
            });
        }).on('error', function(error) {
            console.log('获取数据出错！', error);
        });
    }

    public async checkUrlIsExist(id, url) {
        return await Article.findOne({
            where: {
                id,
                channelUrl: url,
                status: {
                    [Op.not]: Enum.ArticleStatus.DEL
                }
            }
        });
    }

    private filterArticleDom(html) {
        // console.log(html);
        const $ = cheerio.load(html);
        const endPrx = '&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1';
        // const richContentEl = $('#page-content');
        const pageConfig: any = {};

        // 获取文章title
        pageConfig.articleTitle = $('.rich_media_title').text().trim().replace('\t\n', '');
        console.log(pageConfig.articleTitle);
        // 处理所有的img的src问题
        // richContentEl.find('img').filter((i, elem) => elem.attribs['data-src']).each((i, elem) => {
        //     console.log(elem.attribs['data-src'], elem.attribs.src);
        // });
        // console.log($('.__bg_gif '));
        const pArray: any = [{
            type: 'header',
            title: pageConfig.articleTitle,
            color: "#5075c3"
        }];
        $('.rich_media_content').children('p').each((i, item) => {
            if (item.children[0].name === 'img') {
                const parentStyle = item.attribs;
                const childrenStyle = item.children[0].attribs;
                pArray.push({
                    type: 'dom-img',
                    fileList: [],
                    html: `<p style="${parentStyle.style}">
                        <img style="${childrenStyle.style}" src="${childrenStyle['data-src']}${endPrx}"/>
                    </p>`
                });
            }
        });
        pageConfig.articleConfig = JSON.stringify(pArray);
        console.log('asdasd');
        return pageConfig;
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

    public async getArticleListByIds(articleIds) {
        const articleList: any = await Article.findAll({
            where: {
                id: {
                    [Op.in]: articleIds
                }
            },
            attributes: ['id', 'articleTitle', 'articleDesc',
                'articleTypeId', 'status', 'createTime', 'updateTime'
            ],
            raw: true
        });
        articleList.forEach(item => {
            item.createTime = MomentHelper.formatterDate(item.createTime);
            item.updateTime = MomentHelper.formatterDate(item.updateTime);
        });
        return articleList;
    }

    public async createArticleChannel(formData) {
        return await ArticleFolder.create(formData);
    }

    public async checkArticleChannel(id, userId) {
        return await ArticleFolder.findOne({
            where: {
                id,
                userId
            }
        });
    }

    public async userIsCollected(userId, articleId, status) {
        return await UserCollect.findOne({
            where: {
                userId,
                articleId
            }
        })
    }

    public async createCollected(formData) {
        const res = new SvrResponse();
        try {
            await UserCollect.create(formData);
            res.display = '收藏成功';
        } catch (e) {
            res.code = -1;
            res.display = '收藏失败';
        }
        return res;
    }

    public async getCollectedArticle(formData) {
        return await UserCollect.findAll({
            where: {
                userId: formData.userId,
                status: Enum.ArticleCollected.COLLECTED
            }
        });
    }

    public async delArticleChannel(formData) {
        const res = new SvrResponse();
        try {
            const {userId, id} = formData;
            const articleList = await Article.findAll({
                where: {
                    userId,
                    status: {
                        [Op.not]: Enum.ArticleStatus.DEL
                    },
                    articleTypeId: id,
                },
                attributes: ['id']
            });
            const delRes = await ArticleFolder.destroy({
                where: {
                    id
                }
            });
            if (delRes) {
                const articleIds = articleList.map(item => item.id);
                await Article.update({articleTypeId: 0}, {
                    where: {
                        id: {
                            [Op.in]: articleIds
                        }
                    }
                });
            }
        } catch(e) {
            res.code = -1;
            res.display = '删除失败';
        }
        return res;
    }

    public async getArticleChannelList(ctx) {
        return await ArticleFolder.findAll({
            where: {
                userId: ctx.session.userInfo.id
            }
        })
    }

    public async getArticleList(formData) {
        const {folderId, userId} = formData;
        const articleList: any = await Article.findAll({
            where: {
                userId,
                articleTypeId: folderId
            },
            attributes: ['id', 'articleTitle', 'articleDesc',
                'articleTypeId', 'status', 'createTime', 'updateTime'
            ],
            raw: true
        });
        articleList.forEach(item => {
            item.createTime = MomentHelper.formatterDate(item.createTime);
            item.updateTime = MomentHelper.formatterDate(item.updateTime);
        });
        return articleList;
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