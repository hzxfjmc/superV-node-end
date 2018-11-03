/**
 * @description
 * 任务对象
 * @interface scheduleInfo
 */
export interface IScheduleInfo {
    /**
     * 定时规则
     */
    corn: string;
    /**
     * 任务名称
     */
    name: string;
    /**
     * 任务开关
     */
    switch: boolean;
}
