
// https://github.com/koajs/compress
import * as compress from 'koa-compress';
import * as zlib from 'zlib';
import { AbstractEngine } from '../abstract_engine';

export class CompressEngine extends AbstractEngine {
    constructor() {
        super();
    }
    public decorator(app) {
        app.use(compress({
            // filter: function(content_type) {
            //     return /text/i.test(content_type)
            // },
            threshold: 2048,
            flush: zlib.Z_SYNC_FLUSH
        }));
    }
}
