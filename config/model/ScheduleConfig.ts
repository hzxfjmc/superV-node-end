
// import { IScheduleInfo } from '../../schedule/i_schedule_info';
export class ScheduleConfig {

    // public taskList: Array<IScheduleInfo> = [];

    constructor(options) {
        for (const key in options) {
            if (options.hasOwnProperty(key)) {
                if (key.indexOf('SCHEDULE') >= 0) {
                    // this.taskList.push(JSON.parse(options[key]));
                }
            }
        }
    }

}
