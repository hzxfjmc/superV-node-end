import * as Joi from 'joi';
import {SvrResponse} from '../../../model/common/svr_context';
import { PageBusiness } from '../../../business/page_business';
import * as Enum from '../../../model/enums';

export default class PageServices {

    private pageBusiness: PageBusiness;

    constructor() {
        this.pageBusiness = new PageBusiness();
    }

    public async createPage(ctx, formData) {
        const schema = Joi.object().keys({
            articleConfig: Joi.object().required(),
        }).unknown();
        const result = new SvrResponse();
        const {error} = Joi.validate(formData, schema);
        if (error) {
            result.code = -1;
            result.display = '参数错误';
            return result;
        }
        return await this.pageBusiness.createPage(ctx, formData);
    }

    public async stashPage(ctx, formData) {
        const schema = Joi.object().keys({
            articleTitle: Joi.string().required(),
            articleDesc: Joi.string(),
            articleConfig: Joi.array().required(),
            id: Joi.number().required()
        }).unknown();
        const result = new SvrResponse();
        const {error} = Joi.validate(formData, schema);
        if (error) {
            result.code = -1;
            result.display = `参数错误${error}`;
            return result;
        }
        formData.userId = 1;
        const article = await this.pageBusiness.checkArticleExist(formData.id);
        if (!article || article.status === Enum.ArticleStatus.DEL) {
            result.code = -1;
            result.display = '该文章不存在';
            return result;
        }

        return await this.pageBusiness.stashPage(ctx, formData);
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
        const article = await this.pageBusiness.checkArticleExist(formData.id);
        if (!article || article.status === Enum.ArticleStatus.DEL) {
            result.code = -1;
            result.display = '该文章不存在';
            return result;
        }
        result.content = article;
        return result;
    }

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
        return await this.pageBusiness.getHtmlByUrl(ctx, formData);
    }

    public async uploadFile(ctx, formData) {
        return await this.pageBusiness.upload(ctx, formData);
    }
}