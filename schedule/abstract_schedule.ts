import * as schedule from 'node-schedule';
import { Core } from '../core/core';
import { IScheduleInfo } from './i_schedule_info';

/**
 * @description
 * 定时任务
 * @author lizc
 * @export
 * @class AbstractSchedule
 */
export abstract class AbstractSchedule {
    /**
     * 任务对象
     */
    public scheduleInfo: IScheduleInfo;

    public app: Core;

    constructor(app) {
        this.app = app;
    }

    /**
     * @description 开始定时任务
     * @returns {any}
     */
    public startSchedule() {
        return schedule.scheduleJob(this.scheduleInfo.corn, () => {
           this.task();
        });
    }

    /**
     * @description
     * 启动入口
     * @abstract
     * @memberof AbstractSchedule
     */
    public start() {
        this.startSchedule();
    }

    /**
     * @description 定义任务
     * @abstract
     * @memberof AbstractSchedule
     */
    public abstract task();

}
