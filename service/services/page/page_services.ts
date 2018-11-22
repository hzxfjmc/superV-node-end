import * as Joi from 'joi';
import {SvrResponse} from '../../../model/common/svr_context';
import { PageBusiness } from '../../../business/page_business';
import {needLogin, permission} from "../../../core/decorators/auth_decorator";

export default class PageServices {

    private pageBusiness: PageBusiness;

    constructor() {
        this.pageBusiness = new PageBusiness();
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

    @needLogin()
    @permission('admin')
    public async articleList(ctx, formData) {
        const res = new SvrResponse();
        const schema = Joi.object().keys({
            pageSize: Joi.number().required(),
            pageNo: Joi.number().required()
        }).unknown();
        const {error} = Joi.validate(formData, schema);
        if (error) {
            res.code = -1;
            res.display = '参数错误';
            return res;
        }
        formData.userId = ctx.session.userInfo.id;
        return await this.pageBusiness.articleList(ctx, formData);
    }

    @needLogin()
    @permission('admin')
    public async changeArticleStatus(ctx, formData) {
        const res = new SvrResponse();
        const schema = Joi.object().keys({
            id: Joi.number().required(),
            nextStatus: Joi.number().required().allow(3).allow(4)
        }).unknown();
        const {id, nextStatus} = formData;
        const {error} = Joi.validate(formData, schema);
        if (error) {
            res.code = -1;
            res.display = '参数错误';
            return res;
        }
        const article = await this.pageBusiness.checkArticleExist(id);
        if (!article || article.status === Enum.ArticleStatus.DEL) {
            res.code = -1;
            res.display = '该文章不存在';
            return res;
        }
        if (article.status === nextStatus) {
            res.display = '更新文章状态成功';
            return res;
        }
        try {
            article.status = nextStatus;
            article.save();
            res.display = '更新文章状态成功';
        } catch (e) {
            res.code = -1;
            res.display = '更新文章状态失败';
        }
        return res;
    }

}