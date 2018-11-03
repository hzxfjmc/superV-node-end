import * as Joi from 'joi';
import { PageBusiness } from '../../../business/page_business';
import { CombineServices } from '../combine/combine_services';
import { permission } from '../../../core/decorators/auth_decorator';
import {SvrResponse} from '../../../model/common/svr_context';
import * as Enum from '../../../model/enums';
/**
 * description 活动页services
 * @author huangjfc
 */
export class PageServices{
    private name;
    private pageBusiness: PageBusiness;
    private combineServices: CombineServices;
    constructor() {
        this.name = 'page';

        this.pageBusiness = new PageBusiness();
        this.combineServices = new CombineServices();
    }

    /**
     * @description 注册页新增
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | SvrResponse>}
     */
    @permission('activitypage_type_register_create')
    public async registerAdd(ctx, formData) {
        const schema = Joi.object().keys({
            activityName: Joi.string().required(),
            startTime: Joi.string().required(),
            endTime: Joi.string().required(),
            managerId: Joi.string().required(),
            departmentId: Joi.string().required(),
            managerName: Joi.string().required(),
            departmentName: Joi.string().required()
        }).unknown();
        formData.activityType = 1;
        return await this.combineServices.add(ctx, formData, schema);
    }

    /**
     * @description 宣传页新增
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | SvrResponse>}
     */
    @permission('activitypage_type_propagate_create')
    public async propagateAdd(ctx, formData) {
        const schema = Joi.object().keys({
            activityName: Joi.string().required(),
            startTime: Joi.string().required(),
            endTime: Joi.string().required(),
            managerId: Joi.string().required(),
            departmentId: Joi.string().required(),
            managerName: Joi.string().required(),
            departmentName: Joi.string().required()
        }).unknown();
        formData.activityType = 2;
        return await this.combineServices.add(ctx, formData, schema);
    }

    /**
     * @description 福利页新增
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | SvrResponse>}
     */
    @permission('activitypage_type_benefit_create')
    public async benefitAdd(ctx, formData) {
        const schema = Joi.object().keys({
            activityName: Joi.string().required(),
            strategyNumber: Joi.string().required(),
            startTime: Joi.string().required(),
            endTime: Joi.string().required(),
            managerId: Joi.string().required(),
            departmentId: Joi.string().required(),
            managerName: Joi.string().required(),
            departmentName: Joi.string().required()
        }).unknown();
        formData.activityType = 3;
        return await this.combineServices.add(ctx, formData, schema);
    }

    /**
     * @description 注册页编辑
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | SvrResponse>}
     */
    @permission('activitypage_type_register_update')
    public async registerModify(ctx, formData) {
        const schema = Joi.object().keys({
            activityName: Joi.string().required(),
            startTime: Joi.string().required(),
            endTime: Joi.string().required(),
            managerId: Joi.string().required(),
            departmentId: Joi.string().required(),
            managerName: Joi.string().required(),
            departmentName: Joi.string().required(),
            id: Joi.number().required()
        }).unknown();
        return await this.combineServices.modify(ctx, formData, schema);
    }

    /**
     * @description 宣传页编辑
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | SvrResponse>}
     */
    @permission('activitypage_type_propagate_update')
    public async propagateModify(ctx, formData) {
        const schema = Joi.object().keys({
            activityName: Joi.string().required(),
            startTime: Joi.string().required(),
            endTime: Joi.string().required(),
            managerId: Joi.string().required(),
            departmentId: Joi.string().required(),
            managerName: Joi.string().required(),
            departmentName: Joi.string().required(),
            id: Joi.number().required()
        }).unknown();
        return await this.combineServices.modify(ctx, formData, schema);
    }

    /**
     * @description 福利页编辑
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | SvrResponse>}
     */
    @permission('activitypage_type_benefit_update')
    public async benefitModify(ctx, formData) {
        const schema = Joi.object().keys({
            activityName: Joi.string().required(),
            startTime: Joi.string().required(),
            endTime: Joi.string().required(),
            managerId: Joi.string().required(),
            departmentId: Joi.string().required(),
            managerName: Joi.string().required(),
            departmentName: Joi.string().required(),
            strategyNumber: Joi.string().required(),
            id: Joi.number().required()
        }).unknown();
        return await this.combineServices.modify(ctx, formData, schema);
    }

    /**
     * @description 获取注册页详情
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | {code: number; message: string; display: string; content: {}; status: number; time: number; code: number}>}
     */
    @permission('activitypage_type_register_detail')
    public async getRegisterDetail(ctx, formData) {
        return await this.combineServices.getDetail(ctx, formData);
    }
    /**
     * @description 获取宣传页详情
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | {code: number; message: string; display: string; content: {}; status: number; time: number; code: number}>}
     */
    @permission('activitypage_type_propagate_detail')
    public async getPropagateDetail(ctx, formData) {
        return await this.combineServices.getDetail(ctx, formData);
    }

    /**
     * @description 获取福利页详情
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | {code: number; message: string; display: string; content: {}; status: number; time: number; code: number}>}
     */
    @permission('activitypage_type_benefit_detail')
    public async getBenefitDetail(ctx, formData) {
        return await this.combineServices.getDetail(ctx, formData);
    }

    /**
     * @description 注册页上架
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | SvrResponse | SvrResponse | any>}
     */
    @permission('activitypage_type_register_submit')
    public async registerPush(ctx, formData) {
        return await this.combineServices.push(ctx, formData);
    }

    /**
     * @description 宣传页上架
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | SvrResponse | SvrResponse | any>}
     */
    @permission('activitypage_type_propagate_submit')
    public async propagatePush(ctx, formData) {
        return await this.combineServices.push(ctx, formData);
    }

    /**
     * @description 福利页上架
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | SvrResponse | SvrResponse | any>}
     */
    @permission('activitypage_type_benefit_submit')
    public async benefitPush(ctx, formData) {
        return await this.combineServices.push(ctx, formData);
    }

    /**
     * @description 注册页下架
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | SvrResponse | SvrResponse | {code: number; display: string}>}
     */
    @permission('activitypage_type_register_update')
    public async registerDown(ctx, formData) {
        return await this.combineServices.down(ctx, formData);
    }

    /**
     * @description 宣传页下架
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | SvrResponse | SvrResponse | {code: number; display: string}>}
     */
    @permission('activitypage_type_propagate_update')
    public async propagateDown(ctx, formData) {
        return await this.combineServices.down(ctx, formData);
    }

    /**
     * @description 福利页下架
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | SvrResponse | SvrResponse | {code: number; display: string}>}
     */
    @permission('activitypage_type_benefit_update')
    public async benefitDown(ctx, formData) {
        return await this.combineServices.down(ctx, formData);
    }

    /**
     * @description 注册页暂存
     * @author huanjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | SvrResponse | any>}
     */
    @permission('activitypage_type_register_cache')
    public async registerStash(ctx, formData) {
        return await this.combineServices.stash(ctx, formData);
    }

    /**
     * @description 宣传页暂存
     * @author huanjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | SvrResponse | any>}
     */
    @permission('activitypage_type_propagate_cache')
    public async propagateStash(ctx, formData) {
        return await this.combineServices.stash(ctx, formData);
    }

    /**
     * @description 福利页暂存
     * @author huanjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | SvrResponse | any>}
     */
    @permission('activitypage_type_benefit_cache')
    public async benefitStash(ctx, formData) {
        return await this.combineServices.stash(ctx, formData);
    }

    /**
     * @description 删除注册页
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | SvrResponse | {code: number; display: string}>}
     */
    @permission('activitypage_type_register_delete')
    public async deleteRegister(ctx, formData) {
        return await this.combineServices.deleteActivity(ctx, formData);
    }

    /**
     * @description 删除宣传页
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | SvrResponse | {code: number; display: string}>}
     */
    @permission('activitypage_type_propagate_delete')
    public async deletePropagate(ctx, formData) {
        return await this.combineServices.deleteActivity(ctx, formData);
    }

    /**
     * @description 删除福利页
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | SvrResponse | {code: number; display: string}>}
     */
    @permission('activitypage_type_benefit_delete')
    public async deleteBenefit(ctx, formData) {
        return await this.combineServices.deleteActivity(ctx, formData);
    }

    /**
     * @description 获取注册页列表
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | SvrResponse>}
     */
    @permission('activitypage_type_register_retrieve')
    public async registerList(ctx, formData) {
        formData.activityType = 1;
        return await this.combineServices.list(ctx, formData);
    }

    /**
     * @description 获取宣传页列表
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | SvrResponse>}
     */
    @permission('activitypage_type_propagate_retrieve')
    public async propagateList(ctx, formData) {
        formData.activityType = 2;
        return await this.combineServices.list(ctx, formData);
    }

    /**
     * @description 获取福利页列表
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | SvrResponse>}
     */
    @permission('activitypage_type_benefit_retrieve')
    public async benefitList(ctx, formData) {
        formData.activityType = 3;
        return await this.combineServices.list(ctx, formData);
    }

    /**
     * @description 检查活动页状态
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse>}
     */
    public async checkStatus(ctx, formData) {
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
            result.display = '该活动不存在';
        } else if (activity.content.status === Enum.ActivityStatus.HIDE || new Date(activity.content.endTime).getTime() <= new Date().getTime()) {
            result.display = '该活动已下架';
        } else if (activity.content.status === Enum.ActivityStatus.SHOW && new Date(activity.content.startTime).getTime() >= new Date().getTime()) {
            result.display = '活动未开始';
        } else {
            result.content = {
                title: activity.content.shareTitle,
                desc: activity.content.shareDesc,
                imgPath: activity.content.shareIcon,
                ruleCode: activity.content.strategyNumber
            };
        }
        return result;
    }

    /**
     * @description 获取注册页的操作日志
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | SvrResponse>}
     */
    @permission('activitypage_type_register_detail')
    public async registerLogList(ctx, formData) {
        return await this.combineServices.logList(ctx, formData);
    }

    /**
     * @description 获取宣传页的操作日志
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | SvrResponse>}
     */
    @permission('activitypage_type_propagate_detail')
    public async propagateLogList(ctx, formData) {
        return await this.combineServices.logList(ctx, formData);
    }

    /**
     * @description 获取福利页的操作日志
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | SvrResponse>}
     */
    @permission('activitypage_type_benefit_detail')
    public async benefitLogList(ctx, formData) {
        return await this.combineServices.logList(ctx, formData);
    }

    /**
     * @description 获取默认模板
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse | SvrResponse>}
     */
    public async getDefaultConfig(ctx, formData) {
        const result = new SvrResponse();
        const schema = Joi.object().keys({
            activityType: Joi.number().required()
        }).unknown();
        const {error} = Joi.validate(formData, schema);
        if (error) {
            result.code = -1;
            result.display = '参数错误';
            return result;
        }
        result.content = await this.pageBusiness.configList(ctx, formData);
        return result;
    }
}
