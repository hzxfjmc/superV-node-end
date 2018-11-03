
import { AbstractSchedule } from './abstract_schedule';
import { IScheduleInfo } from './i_schedule_info';
import { PageBusiness } from '../business/page_business';

export class ScheduleHelper {

    private scheduleList: Array<AbstractSchedule> = [];
    private pageBusiness: PageBusiness;
    private app;

    constructor(app) {
        this.app = app;
        this.pageBusiness = new PageBusiness();
        this.initStaticTask(app);
    }

    private initStaticTask(app) {
        this.pageBusiness.initAutoSchedule(app);
    }

    private async initTaskFromConfig() {
        const taskList: Array<IScheduleInfo> = this.app.config.scheduleConfig.taskList;
        for (const taskItem of taskList) {
            const path = `${this.app.config.rootPath}/schedule/task/${taskItem.name}_schedule`;
            import(path).then((taskBusiness) => {
                const scheduleItem: AbstractSchedule = new taskBusiness.default(this.app, taskItem);
                if (scheduleItem.scheduleInfo.switch) {
                    scheduleItem.start();
                }
                this.scheduleList.push(scheduleItem);
            }, (err) => {
                this.app.logger.error(`[schedule]初始化失败，找不到配置文件 ${err.message}`);
            });

        }
    }

    public async taskListRun() {
        await this.initTaskFromConfig();
    }

}
