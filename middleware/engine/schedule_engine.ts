
import { Core } from '../../core/core';
import { ScheduleHelper } from '../../schedule/schedule_helper';
import { AbstractEngine } from '../abstract_engine';

export class ScheduleEngine extends AbstractEngine {
    constructor() {
        super();
    }

    public decorator(app: Core) {
        return (async () => {
            const sc = new ScheduleHelper(app);
            await sc.taskListRun();
        })();
    }

};
