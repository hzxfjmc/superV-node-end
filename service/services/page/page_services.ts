import * as Joi from 'joi';
import {SvrResponse} from '../../../model/common/svr_context';
import { PageBusiness } from '../../../business/page_business';
import * as Enum from '../../../model/enums';
import MomentHelper from '../../../helper/moment_helper';
import { Sequelize } from 'sequelize-typescript';
import {needLogin, permission} from "../../../core/decorators/auth_decorator";
import Article from "../../../model/article";

export default class PageServices {

    private pageBusiness: PageBusiness;

    constructor() {
        this.pageBusiness = new PageBusiness();
    }

    public async createPage(ctx, formData) {
        const schema = Joi.object().keys({
            articleConfig: Joi.string(),
        }).unknown();
        const result = new SvrResponse();
        const {error} = Joi.validate(formData, schema);
        if (error) {
            result.code = -1;
            result.display = '参数错误';
            return result;
        }
        formData.userId = ctx.session.userInfo.id;
        return await this.pageBusiness.createPage(ctx, formData);
    }

    public async stashPage(ctx, formData) {
        const schema = Joi.object().keys({
            articleTitle: Joi.string().required(),
            articleDesc: Joi.string(),
            articleConfig: Joi.string().required(),
            id: Joi.number().required()
        }).unknown();
        const result = new SvrResponse();
        const {error} = Joi.validate(formData, schema);
        if (error) {
            result.code = -1;
            result.display = `参数错误${error}`;
            return result;
        }
        formData.userId = ctx.session.userInfo.id;
        const article = await this.pageBusiness.checkArticleExist(formData.id);
        if (!article || article.status === Enum.ArticleStatus.DEL) {
            result.code = -1;
            result.display = '该文章不存在';
            return result;
        }

        return await this.pageBusiness.stashPage(ctx, formData);
    }

    public async pushPage(ctx, formData) {
        const schema = Joi.object().keys({
            articleTitle: Joi.string().required(),
            articleDesc: Joi.string(),
            articleConfig: Joi.string().required(),
            id: Joi.number().required(),
            isPublic: Joi.boolean().required(),
            isShowInfo: Joi.boolean().required(),
            shareShow: Joi.boolean().required(),
            addCopyright: Joi.boolean().required(),
        }).unknown();
        const res = new SvrResponse();
        const {error} = Joi.validate(formData, schema);
        if (error) {
            res.code = -1;
            res.display = `参数错误${error}`;
            return res;
        }
        formData.userId = ctx.session.userInfo.id;
        const article = await this.pageBusiness.checkArticleExist(formData.id);
        if (!article || article.status === Enum.ArticleStatus.DEL) {
            res.code = -1;
            res.display = '该文章不存在';
            return res;
        }
        return await this.pageBusiness.pushPage(ctx, formData);
    }

    public async getArticleDetail(ctx, formData) {
        const schema = Joi.object().keys({
            id: Joi.number().required()
        }).unknown();
        const result = new SvrResponse();
        const {error} = Joi.validate(formData, schema);
        if (error) {
            result.code = -1;
            result.display = `参数错误${error}`;
            return result;
        }
        const article: any = await this.pageBusiness.checkArticleExist(formData.id);
        if (!article || article.status === Enum.ArticleStatus.DEL) {
            result.code = -1;
            result.display = '该文章不存在';
            return result;
        }
        if (article.status === Enum.ArticleStatus.PUBLIC) {
            Article.update({readTotal: Sequelize.literal('`read_total` + 1' )}, {
                where: {id: formData.id}
            });
        }
        article.createTime = MomentHelper.formatterDate(article.createTime, 'YYYY-MM-DD');
        article.updateTime = MomentHelper.formatterDate(article.updateTime, 'YYYY-MM-DD');
        result.content = article;
        return result;
    }

    public async createArticleChannel(ctx, formData) {
        const schema = Joi.object().keys({
            folderName: Joi.string().required()
        }).unknown();
        const res = new SvrResponse();
        const {error} = Joi.validate(formData, schema);
        if (error) {
            res.code = -1;
            res.display = '参数错误';
            return res;
        }
        formData.userId = ctx.session.userInfo.id;
        return await this.pageBusiness.createArticleChannel(formData);
    }

    public async editArticleChannel(ctx, formData) {
        const schema = Joi.object().keys({
            folderName: Joi.string().required(),
            id: Joi.number().required()
        }).unknown();
        const res = new SvrResponse();
        const {error} = Joi.validate(formData, schema);
        if (error) {
            res.code = -1;
            res.display = '参数错误';
            return res;
        }

        const folder = await this.pageBusiness.checkArticleChannel(formData.id, ctx.session.userInfo.id);
        if (!folder) {
            res.code = -1;
            res.display = '该文章列表类型不存在';
            return res;
        }
        try {
            folder.folderName = formData.folderName;
            await folder.save();
            res.display = '修改成功';
        } catch(e) {
            res.code = -1;
            res.display = '修改失败';
        }
        return res;
    }

    public async moveArticleTo(ctx, formData) {
        const schema = Joi.object().keys({
            id: Joi.number().required(),
            articleId: Joi.number().required()
        }).unknown();
        const res = new SvrResponse();
        const {error} = Joi.validate(formData, schema);
        if (error) {
            res.code = -1;
            res.display = '参数错误';
            return res;
        }
        const folder = await this.pageBusiness.checkArticleChannel(formData.id, ctx.session.userInfo.id);
        if (!folder) {
            res.code = -1;
            res.display = '该文件不存在';
            return res;
        }
        const article = await this.pageBusiness.checkArticleExist(formData.articleId);
        if (!article || article.status === Enum.ArticleStatus.DEL) {
            res.code = -1;
            res.display = '该文章不存在';
            return res;
        }
        try {
            article.articleTypeId = formData.id;
            await article.save();
            res.display = '操作成功';
        } catch(e) {
            res.code = -1;
            res.display = '操作失败';
        }
        return res;
    }

    public async getArticleChannelList(ctx, formData) {
        return await this.pageBusiness.getArticleChannelList(ctx);
    }

    public async delArticleChannel(ctx, formData) {
        const schema = Joi.object().keys({
            id: Joi.number().required()
        }).unknown();
        const res = new SvrResponse();
        const {error} = Joi.validate(formData, schema);
        if (error) {
            res.code = -1;
            res.display = '参数错误';
            return res;
        }
        const folder = await this.pageBusiness.checkArticleChannel(formData.id, ctx.session.userInfo.id);

        if (!folder) {
            res.code = -1;
            res.display = '该文章列表类型不存在';
            return res;
        }
        formData.userId = ctx.session.userInfo.id;
        return await this.pageBusiness.delArticleChannel(formData);
    }

    public async getArticleList(ctx, formData) {
        const res = new SvrResponse();
        const schema = Joi.object().keys({
            folderId: Joi.number().required()
        }).unknown();
        const { error } = Joi.validate(formData, schema);
        const {folderId} = formData;
        if (error) {
            res.code = -1;
            res.display = '参数错误';
            return res;
        }

        if (folderId !== 0) {
            const folder = await this.pageBusiness.checkArticleChannel(folderId, ctx.session.userInfo.id);
            if (!folder) {
                res.code = -1;
                res.display = '该文章列表类型不存在';
                return res;
            }
        }

        formData.userId = ctx.session.userInfo.id;
        res.content = await this.pageBusiness.getArticleList(formData);
        return res;
    }

    public async changeCollectStatus(ctx, formData) {
        const schema = Joi.object().keys({
            status: Joi.number().required(),
            articleId: Joi.number().required()
        }).unknown();
        const res = new SvrResponse();
        const {articleId, status} = formData;
        const { error } = Joi.validate(formData, schema);
        if (error) {
            res.code = -1;
            res.display = '参数错误';
            return res;
        }
        const article = await this.pageBusiness.checkArticleExist(formData.articleId);
        if (!article || article.status === Enum.ArticleStatus.DEL) {
            res.code = -1;
            res.display = '该文章不存在';
            return res;
        }
        formData.userId = ctx.session.userInfo.id;
        const collect = await this.pageBusiness.userIsCollected(formData.userId, articleId, status);
        if (!collect && status === Enum.ArticleCollected.COLLECTED) {
            return await this.pageBusiness.createCollected(formData);
        } else if (collect && status === Enum.ArticleCollected.UNCOLLECTED) {
            try {
                collect.status = status;
                await collect.save();
                res.display = '取消收藏成功';
            } catch(e) {
                res.code = -1;
                res.display = '取消收藏失败';
            }
        } else {
            res.code = -1;
            res.display = '操作异常';
        }
        return res;
    }

    public async getCollectedArticle(ctx, formData) {
        const res = new SvrResponse();
        formData.userId = ctx.session.userInfo.id;
        const collectedList = await this.pageBusiness.getCollectedArticle(formData);

        const articleIds = collectedList.map(item => item.articleId);

        res.content = await this.pageBusiness.getArticleListByIds(articleIds);
        return res;
    }

    // @needLogin()
    public async getHtmlByUrl(ctx, formData) {
        const schema = Joi.object().keys({
            url: Joi.string()
        }).unknown();
        const result = new SvrResponse();
        const {error} = Joi.validate(formData, schema);
        if (error) {
            result.code = -1;
            result.display = '参数错误';
            return result;
        }
        // const {url} = formData;
        // const {id} = ctx.session.userInfo;
        // const article = await this.pageBusiness.checkUrlIsExist(id, url);
        //
        // if (article) {
        //     res.code = -1;
        //     res.display = '已经导入过此篇文章';
        //     return res;
        // }

        return await this.pageBusiness.getHtmlByUrl(ctx, formData);
    }

    public async uploadFile(ctx, formData) {
        return await this.pageBusiness.upload(ctx, formData);
    }
}