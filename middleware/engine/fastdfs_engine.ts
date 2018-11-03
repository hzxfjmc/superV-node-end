import { Core } from '../../core/core';
import { AbstractEngine } from '../abstract_engine';
import * as FdfsClient from 'fdfs';
export class FastdfsEngine extends AbstractEngine {
    constructor() {
        super();
    }

    public decorator(app: Core) {
        app.fdfs = new FdfsClient({
            timeout: 10000,
            defaultExt: 'txt',
            charset: 'utf8',
            trackers: app.config.fastdfsTrackers
        });
    }
}
