import { AbstractEngine } from './abstract_engine';
import { BodyParseEngine } from './engine/body_parse_engine';
import { CompressEngine } from './engine/compress_engine';
import { DbEngine } from './engine/db_engine';
import { ErrorEngine } from './engine/error_engine';
// import { RedisEngine } from './engine/redis_engine';
import { RequestFilterEngine } from './engine/request_filter_engine';
import { RouterEngine } from './engine/router_engine';
import { ScheduleEngine } from './engine/schedule_engine';
import { SessionEngine } from './engine/session_engine';
import { StaticServerEngine } from './engine/static_server_engine';
import { UserAgentEngine } from './engine/user_agent_engine';
import {FastdfsEngine} from './engine/fastdfs_engine';

export class EnginesHelper {

    private compressEngine: AbstractEngine;
    private errorEngine: AbstractEngine;
    private bodyParseEngine: AbstractEngine;
    private routerEngine: AbstractEngine;
    private sessionEngine: AbstractEngine;
    // private redisEngine: AbstractEngine;
    private staticServerEngine: AbstractEngine;
    private userAgentEngine: AbstractEngine;
    private requestFilterEngine: AbstractEngine;
    private dbEngine: AbstractEngine;
    private scheduleEngine: AbstractEngine;
    private fastdfsEngine: AbstractEngine;

    constructor() {
        this.compressEngine = new CompressEngine();
        // this.redisEngine = new RedisEngine();
        this.bodyParseEngine = new BodyParseEngine();
        this.errorEngine = new ErrorEngine();
        this.routerEngine = new RouterEngine();
        this.sessionEngine = new SessionEngine();
        this.staticServerEngine = new StaticServerEngine();
        this.userAgentEngine = new UserAgentEngine();
        this.requestFilterEngine = new RequestFilterEngine();
        this.dbEngine = new DbEngine();
        this.scheduleEngine = new ScheduleEngine();
        this.fastdfsEngine = new FastdfsEngine();
    }

    public decoratorContext(app) {
        this.errorEngine.decorator(app);
        this.staticServerEngine.decorator(app);
        this.fastdfsEngine.decorator(app);
        // this.redisEngine.decorator(app);
        // this.ratelimiterEngine.decorator(app);
        this.sessionEngine.decorator(app);
        this.bodyParseEngine.decorator(app);
        this.userAgentEngine.decorator(app);
        this.requestFilterEngine.decorator(app);
        this.compressEngine.decorator(app);
        this.dbEngine.decorator(app);
        this.routerEngine.decorator(app);
        this.scheduleEngine.decorator(app);
    }
}
