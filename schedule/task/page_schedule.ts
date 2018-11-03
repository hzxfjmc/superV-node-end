import { AbstractSchedule } from '../abstract_schedule';
import { Core } from '../../core/core';
import {PageBusiness} from '../../business/page_business';

export default class PageSchedule extends AbstractSchedule {

    private pageBusiness: PageBusiness;

    constructor(app: Core, taskItem) {
        super(app);
        this.pageBusiness = new PageBusiness();
        this.scheduleInfo = taskItem || {
            corn: '0 0 0 * * 1', // 每周1的0点0分0秒
            name: 'page',
            switch: true
        };
    }

    public async task() {
        await this.pageBusiness.deleteFiles(this.app);
    }

}
