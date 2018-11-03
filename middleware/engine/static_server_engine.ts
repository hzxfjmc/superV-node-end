'use strict';
import * as mount from 'koa-mount';
import * as serve from 'koa-static';
import * as path from 'path';
import { Core } from '../../core/core';
import { AbstractEngine } from '../abstract_engine';

/**
 * @description 提供静态资源服务引擎
 * @author cairc
 * @export
 * @class StaticServerEngine
 * @extends {AbstractEngine}
 */
export class StaticServerEngine extends AbstractEngine {
    constructor() {
        super();
    };
    public decorator(app: Core) {
        const staticDir = path.join(app.config.rootPath, '../../cms/h5');
        app.use(mount('/cms', serve(staticDir, {
            maxage: app.config.env === 'development' ? 0 : 60 * 60 * 24 * 7,
            gzip: app.config.enableCompress
        })));
    }
}
