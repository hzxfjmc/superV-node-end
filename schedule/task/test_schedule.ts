
import { Core } from '../../core/core';
import { AbstractSchedule } from '../abstract_schedule';
import { IScheduleInfo } from '../i_schedule_info';

export default class TestSchedule extends AbstractSchedule {

    constructor(app: Core, scheduleInfo: IScheduleInfo) {
        super(app);
        this.scheduleInfo = scheduleInfo;
    }
    public task() { }

}
