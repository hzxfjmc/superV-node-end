import { AbstractServices } from '../abstract_services';
import {SvrResponse} from '../../../model/common/svr_context';
import { PageBusiness } from '../../../business/page_business';
import * as Joi from 'joi';
import * as Enum from '../../../model/enums';

export class CombineServices extends AbstractServices {
    private pageBusiness: PageBusiness;
    constructor() {
        super();
        this.name = 'combine';
        this.pageBusiness = new PageBusiness();
    }

    /**
     * 新增活动信息
     * @author huangjfc
     * @param ctx
     * @param formData
     * @param schema
     * @returns {Promise<SvrResponse>}
     */
    public async add(ctx, formData, schema) {
        const result = new SvrResponse();
        const { error } = Joi.validate(formData, schema);
        if (error) {
            result.code = -1;
            result.display = '参数错误';
            return result;
        }
        return await this.pageBusiness.add(ctx, formData);
    }

    /**
     * 编辑活动信息
     * @author huangjfc
     * @param ctx
     * @param formData
     * @param schema
     * @returns {Promise<any>}
     */
    public async modify(ctx, formData, schema) {
        const result = new SvrResponse();
        const { error } = Joi.validate(formData, schema);
        if (error) {
            result.code = -1;
            result.display = '参数错误';
            return result;
        }
        return await this.pageBusiness.modify(ctx, formData);
    }

    /**
     * 获取活动信息
     * @param ctx
     * @param formData
     * @returns {Promise<any>}
     */
    public async getDetail(ctx, formData) {
        const result = new SvrResponse();
        const schema = Joi.object().keys({
            id: Joi.number().required()
        }).unknown();
        const { error } = Joi.validate(formData, schema);
        if (error) {
            result.code = -1;
            result.display = '参数错误';
            return result;
        }
        const detail = await this.pageBusiness.getDetail(formData);
        return {...result, ...detail};
    }

    /**
     * 编辑页 上架操作
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse>}
     */
    public async push(ctx, formData) {
        const result = new SvrResponse();
        const schema = Joi.object().keys({
            id: Joi.number().required(),
            value: Joi.array().required(),
            shareTitle: Joi.string().required(),
            shareDesc: Joi.string().required(),
            html: Joi.string().required()
        }).unknown();
        const { error } = Joi.validate(formData, schema);
        if (error) {
            result.code = -1;
            result.display = `参数错误${error}`;
            return result;
        }
        const activity: any =  await this.pageBusiness.getDetail(formData);

        if (activity.code !== 0 || activity.content.status === Enum.ActivityStatus.DELETE) {
            result.code = -1;
            result.display = '该活动不存在';
            return result;
        }

        if (activity.content.status === Enum.ActivityStatus.SHOW) {
            result.code = -1;
            result.display = '该活动已上架，请勿重复操作';
            return result;
        }
        return await this.pageBusiness.push(ctx, formData, activity.content);
    }

    /**
     * 下架操作
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<any>}
     */
    public async down(ctx, formData) {
        const result = new SvrResponse();
        const schema = Joi.object().keys({
            id: Joi.number().required()
        }).unknown();
        const { error } = Joi.validate(formData, schema);
        if (error) {
            result.code = -1;
            result.display = '参数错误';
            return result;
        }

        const activity: any = await this.pageBusiness.getDetail(formData);

        if (activity.code !== 0 || activity.content.status === Enum.ActivityStatus.DELETE) {
            result.code = -1;
            result.display = '该活动不存在';
            return result;
        }

        if (activity.content.status === Enum.ActivityStatus.HIDE) {
            result.code = -1;
            result.display = '该活动已下架，请勿重复操作';
            return result;
        }
        return await this.pageBusiness.down(ctx, formData);
    }

    /**
     * 暂存
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<any>}
     */
    public async stash(ctx, formData) {
        const result = new SvrResponse();
        const schema = Joi.object().keys({
            id: Joi.number().required()
        }).unknown();
        const { error } = Joi.validate(formData, schema);
        if (error) {
            result.code = -1;
            result.display = '参数错误';
            return result;
        }

        const activity: any = await this.pageBusiness.getDetail(formData);

        if (activity.code !== 0 || activity.content.status === Enum.ActivityStatus.DELETE) {
            result.code = -1;
            result.display = '该活动不存在';
            return result;
        }

        return await this.pageBusiness.stash(ctx, formData, activity.content);
    }

    /**
     * @description 删除活动
     * @author oyff
     * @param {*} ctx
     * @param {*} formData
     * @returns
     * @memberof PageServices
     */
    public async deleteActivity(ctx, formData) {
        const result = new SvrResponse();
        const schema = Joi.object().keys({
            id: Joi.number().required()
        }).unknown();
        const { error } = Joi.validate(formData, schema);
        if (error) {
            result.code = -1;
            result.display = '参数错误';
            return result;
        }

        const activity: any = await this.pageBusiness.getDetail(formData);

        if (activity.code !== 0 || activity.content.status === Enum.ActivityStatus.DELETE) {
            result.code = -1;
            result.display = '该活动不存在';
            return result;
        }

        return await this.pageBusiness.deleteActivity(ctx, formData);
    }

    /**
     * @description
     * @author oyff 活动列表
     * @param {*} ctx
     * @param {*} formData
     * @returns
     * @memberof PageServices
     */
    public async list(ctx, formData) {
        const result = new SvrResponse();
        const schema = Joi.object().keys({
            activityName: Joi.string().allow(''),
            activityType: Joi.number().required(),
            status: Joi.number(),
            startTime: Joi.array(),
            orderKey: Joi.string().allow(''),
            orderType: Joi.string().allow(''),
        }).unknown();

        const { error } = Joi.validate(formData, schema);
        if (error) {
            result.code = -1;
            result.display = '参数错误';
            return result;
        }
        return await this.pageBusiness.list(ctx, formData);
    }

    /**
     * 获取操作日志
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse>}
     */
    public async logList(ctx, formData) {
        const result = new SvrResponse();
        const schema = Joi.object().keys({
            id: Joi.number().required()
        }).unknown();
        const { error } = Joi.validate(formData, schema);
        if (error) {
            result.code = -1;
            result.display = '参数错误';
            return result;
        }
        result.content = await this.pageBusiness.logList(ctx, formData);
        return result;
    }
}
