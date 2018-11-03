import * as fs from 'fs';
import * as moment from 'moment';
import * as path from 'path';
import * as pug from 'pug';
import { Op } from 'sequelize';
import MomentFormat from '../helper/moment_helper';
import UuidHelper from '../helper/uuid_helper';
import Paging from '../helper/paging';
import Activity from '../model/activity';
import {SvrResponse} from '../model/common/svr_context';
import * as Enum from '../model/enums';
import ModelConfig from '../model/model_config';
import OperateLog from '../model/operate_log';
import {FdfsBusiness} from './fdfs_business';
import * as schedule from 'node-schedule';

const rootPath = path.resolve(__dirname, '../../../');

/**
 * @description 活动页面
 * @author huangjfc
 * @export
 * @class PageBusiness
 */
export class PageBusiness {

    private fdfsBusiness: FdfsBusiness;
    constructor() {
        this.fdfsBusiness = new FdfsBusiness();
    }

    /**
     * @description 新增活动信息
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse>}
     */
    public async add(ctx, formData) {
        const result = new SvrResponse();
        try {
            const activity = await Activity.create({...formData});
            this.operateLog(ctx, activity, 'add');
            result.content = {id: activity.id};
        } catch (e) {
            result.code = -1;
            result.display = '创建失败';
        }
        return result;
    }

    /**
     * @description 编辑活动信息
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<SvrResponse>}
     */
    public async modify(ctx, formData) {
        const result = new SvrResponse();
        const {id} = formData;
        if (!await Activity.findById(id)) {
            result.code = -1;
            result.display = '该活动不存在';
            return result;
        }
        try {
            await Activity.update({...formData}, {where: {id}});
            this.operateLog(ctx, formData, 'modify');
            result.content = {id};
        } catch (e) {
            result.code = -1;
            result.display = '更新失败';
        }
        return result;
    }

    /**
     * @description 获取活动信息
     * @author huangjfc
     * @param formData
     * @returns {Promise<{content: Activity} | {code: number; display: string}>}
     */
    public async getDetail(formData) {
        const {id} = formData;
        const activityDetail: any = await Activity.findOne({where: {id}, raw: true});
        if (activityDetail) {
            activityDetail.startTime = MomentFormat.formatterDate(activityDetail.startTime);
            activityDetail.endTime = MomentFormat.formatterDate(activityDetail.endTime);
        }
        return activityDetail ? {code: 0, content: activityDetail} : {code: -1, display: '该活动不存在'};
    }

    /**
     * @description 活动上架
     * @author huangjfc
     * @param ctx
     * @param activity
     * @param formData
     * @returns {Promise<SvrResponse>}
     */
    public async push(ctx, formData, activity) {
        const {value}  = formData;
        const data = this.formatterData(value, ctx);
        let res: any = null;
        if (activity.activityPageUrl && /\/(\d+).html/.test(activity.activityPageUrl)) {
            res = await this.renderStringToFile(ctx, {...formData, ...data, status: Enum.ActivityStatus.SHOW}, 'push', activity);
        } else {
            res = await this.renderStringToFileFastDfs(ctx, {...formData, ...data, status: Enum.ActivityStatus.SHOW}, 'push', activity);
        }
        if (res.code === 0) {
            this.operateLog(ctx, formData, 'push');
            ctx.app.scheduleDown[activity.id] = schedule.scheduleJob(new Date(activity.endTime), async () => {
                const result = await this.down(ctx, {id: formData.id, action: 'autoDown'});
                ctx.app.logger.info('【定时下架任务】 \n【参数】:' + formData.id + '\n 【正文】: ' + JSON.stringify(result));
            });
        }
        return res;
    }

    /**
     * @description 活动下架
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Promise<void>}
     */
    public async down(ctx, formData) {
        const {id} = formData;
        try {
            const activity = await Activity.findById(id);
            if (activity.status === Enum.ActivityStatus.SHOW) {
                activity.status = Enum.ActivityStatus.HIDE;
                activity.save();
                this.operateLog(ctx, formData, 'down');
                ctx.app.scheduleDown[id].cancel();
                delete ctx.app.scheduleDown[id];
            }
            return {code: 0, display: '下架成功'};
        } catch (e) {
            return {code: -1, display: '下架失败，请重试'};
        }
    }

    /**
     * @description 暂存
     * @author huangjfc
     * @param ctx
     * @param formData
     * @param activity
     * @returns {Promise<{code: number; display: string}>}
     */
    public async stash(ctx, formData, activity) {
        const result = new SvrResponse();
        const {value, html, id} = formData;
        try {
            if (html) {
                const data = this.formatterData(value, ctx);
                const res: any = await this.renderStringToFileFastDfs(ctx, {...formData, ...data}, 'stash', activity);
                res.code === 0 && this.operateLog(ctx, formData, 'stash');
                return res;
            }
            await Activity.update({activityJson: JSON.stringify(value), ...formData}, {where: {id}});
            return result;
        } catch (e) {
            return {code: -1, display: `暂存失败${JSON.stringify(e)}`};
        }
    }

    /**
     * @description 删除活动
     * @author oyff
     * @param {*} ctx
     * @param {*} formData
     * @returns
     * @memberof PageBusiness
     */
    public async deleteActivity(ctx, formData) {
        const {id} = formData;
        try {
            await Activity.update({status: Enum.ActivityStatus.DELETE}, {where: {id}});
            this.operateLog(ctx, formData, 'delete');
            return {code: 0, display: '删除成功'};
        } catch (e) {
            return {code: -1, display: '删除失败，请重试'};
        }
    }

    /**
     * @description 处理静态资源
     * @author huangjfc
     * @param value
     * @param ctx
     * @returns {{cssPaths: any[]; jsPaths: any[]; config: any}}
     */
    private formatterData(value, ctx) {
        // const referer = ctx.req.headers.referer.replace(/\/$/, '').replace(/(http|https):/, '');
        const {staticOrigin} = ctx.app.config;
        const isDev = process.env.NODE_ENV === 'development';
        const staticPath = value.filter(item => item.type === 'static');
        const cssPaths = (staticPath[0].css || []).map(css => isDev ? css : `${staticOrigin}${css}`);
        const jsPaths = (staticPath[0].js || []).map(js => isDev ? js : `${staticOrigin}${js}`);
        const config = value[0];
        return {cssPaths, jsPaths, config};
    }

    /**
     * @description 写入文件
     * @author huangjfc
     * @param ctx
     * @param data
     * @param action
     * @param activity
     * @returns {Promise<SvrResponse>}
     */
    private async renderStringToFile (ctx, data, action, activity) {
        const result = new SvrResponse();
        const { pushPath, stashPath} = ctx.app.config.paths;
        let dirPath = stashPath;
        let fileName = UuidHelper.gen() + '.html';
        if (action === 'push') {
            dirPath = pushPath;
            fileName = data.id + '.html';
        }
        const {id, html, value, cssPaths, jsPaths, config, ...restData} = data;
        config.id = id;
        const templatePath = path.resolve(rootPath, 'views/template1.pug');
        const htmlStr = pug.renderFile(templatePath, {htmlInner: html, cssPaths, jsPaths, config});
        return new Promise((resolve, reject) => {
            fs.writeFile(`${dirPath}/${fileName}`, htmlStr, async (err) => {
                if (!err) {
                    const url = this.handlePath(ctx, fileName, action, activity);
                    await Activity.update({
                        ...restData,
                        ...url,
                        activityJson: JSON.stringify(value)
                    }, {where: {id}});
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
    private async renderStringToFileFastDfs (ctx, data, action, activity) {
        const result = new SvrResponse();
        const {id, html, value, cssPaths, jsPaths, config, ...restData} = data;
        config.id = id;
        const templatePath = path.resolve(rootPath, 'views/template1.pug');
        const htmlStr = pug.renderFile(templatePath, {htmlInner: html, cssPaths, jsPaths, config});
        const fileRes: any = action === 'stash' ? await this.stashUploadFile(ctx, htmlStr) : await this.pushUploadFile(ctx, htmlStr, activity);
        try {
            if (fileRes.fileId) {
                const url = this.handlePath(ctx, fileRes.fileId, action, activity);
                const beforeStashUrl = activity.stashPageUrl;
                await Activity.update({
                    ...restData,
                    ...url,
                    activityJson: JSON.stringify(value)
                }, {where: {id}});
                if (beforeStashUrl && action === 'stash') {
                    this.fdfsBusiness.delFile(ctx, beforeStashUrl.split('newPreview/')[1].split('?')[0]);
                }
                result.content = url;
            } else {
                result.code = -1;
                result.display = fileRes.display;
            }
        } catch (e) {
            return {code: -1 , display: '暂存失败'};
        }

        return result;
    }

    private async stashUploadFile(ctx, htmlStr) {
        const fileData = {buffer: htmlStr, ext: 'html'};
        return await this.fdfsBusiness.uploadSingle(ctx, fileData);
    }

    private async pushUploadFile(ctx, htmlStr, activity) {
        const fileData: any = {method: 'uploadAppender', buffer: htmlStr, ext: 'html'};
        if (activity.activityPageUrl) {
            fileData.method = 'modify';
            fileData.offset = 0;
            fileData.fileId = activity.activityPageUrl.split('newActivity/')[1].split('?')[0];
        }
        return await new FdfsBusiness().uploadSingle(ctx, fileData);
    }

    /**
     * @description 处理生成文件到访问地址
     * @author huangjfc
     * @param ctx
     * @param fileName
     * @param action
     * @param activity
     * @returns {{activityPageUrl: string; stashPageUrl: string} | {stashPageUrl: string}}
     */
    private handlePath(ctx, fileName, action, activity) {
        const referer = ctx.req.headers.referer;
        const origin = ctx.app.config.deployOrigin;
        const isOld = fileName.indexOf('/') === -1;
        const activitySign = isOld ? 'activity' : 'newActivity';
        const previewSign = isOld ? 'preview' : 'newPreview';
        let url = '';
        const params = `?id=${activity.id || ''}&mchId=${activity.storeNumber || ''}&code=${activity.invitationCode || ''}&companyId=&group=`;
        // if (activity.activityType === 3) {
        //     params = '';
        // }
        if (process.env.NODE_ENV === 'production') {
            url = action === 'push' ? `${origin}/cms/h5/${activitySign}/${fileName}${params}` : `${referer}h5/${previewSign}/${fileName}`;
        } else {
            url = action === 'push' ? `${referer}assets/h5/${activitySign}/${fileName}${params}` : `${referer}assets/h5/${previewSign}/${fileName}`;
        }
        return action === 'push' ? {activityPageUrl: url} : {stashPageUrl: url};
    }

    /**
     * 获取操作日志列表
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Bluebird<{rows: OperateLog[]; count: number}>}
     * @constructor
     */
    public async logList(ctx, formData) {
        const {pageSize = 10, pageNo = 1, id} = formData;
        const offset = (pageNo - 1) * pageSize;
        const list = await OperateLog.findAndCountAll({
            where: {activityId: id},
            offset,
            limit: Number(pageSize),
            order: [['create_time', 'desc']],
            raw: true
        });
        list.rows.forEach((item: any) => {
            item.createTime = MomentFormat.formatterDate(item.createTime);
        });
        return Paging.structure(pageNo, pageSize, list.count, list.rows);
    }

    /**
     * @description 获取活动列表
     * @author oyff
     * @param {*} ctx
     * @param {*} formData
     * @returns
     * @memberof PageBusiness
     */
    public async list(ctx, formData) {
        const result = new SvrResponse();
        const {
            pageSize = 10,
            pageNo = 1,
            activityName = '',
            activityType,
            status,
            orderKey = 'startTime',
            orderType = 'DESC',
        } = formData;
        const startTimeFrom = formData.startTime ? MomentFormat.getFormatDate(formData.startTime[0]) : '';
        const startTimeTo = formData.startTime ? MomentFormat.getFormatDate(formData.startTime[1]) : '';
        const filter = {
            activityName: {
                [Op.like]: `%${activityName}%`,
            },
            activityType,
            status: status !== undefined ? status : {[Op.in] : [0, 1, 2]},
            start_time: {
                [Op.between]: [startTimeFrom, startTimeTo]
            },
        };
        if (!formData.startTime){
            delete filter.start_time;
        }
        for (const i in filter) {
            if (filter[i] === undefined){
                delete(filter[i]);
            }
        }
        const offset = (pageNo - 1) * pageSize;
        const activitylist = await Activity.findAndCountAll({
            where: filter,
            offset,
            limit: Number(pageSize),
            order: [[orderKey, orderType]],
            raw: true
        });
        activitylist.rows.forEach((item: any) => {
            item.startTime = MomentFormat.formatterDate(item.startTime);
            item.endTime = MomentFormat.formatterDate(item.endTime);
        });
        result.content = Paging.structure(pageNo, pageSize, activitylist.count, activitylist.rows);
        return result;
    }

    /**
     * @description 记录操作日志、
     * @author huangjfc
     * @param ctx
     * @param formData
     * @param action
     * @returns {Promise<void>}
     */
    public async operateLog(ctx, formData, action) {
        const {id} = formData;
        let {userInfo = {}} = ctx;
        if (formData.action === 'autoDown') {
            userInfo = {userName: '系统自动化下架任务', userId: '系统', deptId: '系统'};
        }
        const operateMap = {
            add: {action: '活动页配置新增', state: 0},
            modify: {action: '活动页配置修改', state: 0},
            stash: {action: '活动页配置暂存', state: 0},
            push: {action: '活动页发布', state: 1},
            down: {action: '活动页下架', state: 2},
            delete: {action: '活动页删除', state: 3}
        };
        const data = {
            ...operateMap[action] || {},
            activityId: id,
            operatorName: userInfo.userName,
            operatorId: userInfo.userId,
            operatorDepartmentName: userInfo.deptId,
            remark: ''
        };
        try {
            await OperateLog.create({...data});
        } catch (e) {
            ctx.app.logger.error('【写入操作日志失败】:\n 【参数】:' + JSON.stringify(data) + '\n 【正文】:' + e.stack);
        }

    }

    /**
     * @description 获取默认的页面config
     * @author huangjfc
     * @param ctx
     * @param formData
     * @returns {Bluebird<ModelConfig[]>}
     */
    public async configList(ctx, formData) {
        const {activityType} = formData;
        return await ModelConfig.findAll({
            where: {
                activityType
            }
        });
    }

    /**
     * @description 删除7天前生成的暂存文件，并更新表
     * @author huangjfc
     * @param app
     * @returns {Promise<void>}
     */
    public async deleteFiles(app){
        const filePath = app.config.paths.stashPath;
        const delPeriod = 7;
        // const delFiles = [];
        const dateSign = moment().subtract(delPeriod, 'days').format('YYYY-MM-DD');
        // 根据文件路径读取文件，返回文件列表
        fs.readdir(filePath, (err, files) => {
            if (err){
                app.logger.warn(err);
            }else{
                // 遍历读取到的文件列表
                files.forEach((filename, index) => {
                    // 获取当前文件的绝对路径
                    const filedir = path.join(filePath, filename);
                    // 根据文件路径获取文件信息，返回一个fs.Stats对象
                    fs.stat(filedir, (error , stats) => {
                        if (error){
                            app.logger.warn('获取文件stats失败');
                        }else{
                            const DaysDiff = moment(MomentFormat.getCurrentDate('YYYY-MM-DD'))
                                .diff(MomentFormat.formatterDate(stats.mtime, 'YYYY-MM-DD'), 'days');
                            if(stats.isFile() && DaysDiff >= delPeriod){
                                fs.unlink(filedir,  err  => {
                                    if (err) {
                                        app.logger.error('【删除文件失败】:' + '【文件名】:' + filedir + '【错误信息】:' + err);
                                    } else {
                                        // delFiles.push(filedir);
                                        app.logger.info('【定时任务删除文件成功】'  + '【文件名】:' + filedir);
                                    }
                                });
                            }
                        }
                    });
                });
                // 根据时间更新stashPageUrl
                app.logger.info('【定时任务更新stashPageUrl字段】');
                Activity.update({stashPageUrl: ''}, {
                    where: {
                        updateTime: {
                            [Op.lt]: dateSign
                        }
                    }
                });
            }
        });
    }

    public async initAutoSchedule(app) {
        const currentDate = MomentFormat.formatterDate(new Date());
        // 获取状态为已上架，下架时间不大于当前时间的活动
        const activity: Activity[] = await Activity.findAll({
            where: {
                status: Enum.ActivityStatus.SHOW,
            },
            raw: true
        });
        const needDownIds = [];
        const willDown = [];
        activity.forEach(item => {
            if (moment(item.endTime).isBefore(currentDate, 'second')) {
                needDownIds.push(item.id);
            } else {
                willDown.push({id: item.id, endTime: item.endTime});
            }
        });
        // 遍历得到需要下架更新状态的ids
        try {
            if (needDownIds.length > 0) {
                await Activity.update({status: Enum.ActivityStatus.HIDE}, {
                    where: {
                        id: {
                            [Op.in]: needDownIds
                        }
                    }
                });
                app.logger.info('【批量下架成功】【参数】:' + needDownIds);
            }
        } catch(e) {
            app.logger.error('【批量下架失败】【参数】:' + needDownIds);
        }

        // 将要下架的写成定时任务
        app.scheduleDown = {};
        app.logger.info('【willdown】' + JSON.stringify(willDown));
        willDown.forEach(item => {
            app.scheduleDown[item.id] = schedule.scheduleJob(new Date(item.endTime), async () => {
                const res = await this.down({app}, {id: item.id, action: 'autoDown'});
                app.logger.info('【定时下架任务】 \n【参数】:' + item.id + '\n 【正文】: ' + JSON.stringify(res));
            });
        });
    }
}
