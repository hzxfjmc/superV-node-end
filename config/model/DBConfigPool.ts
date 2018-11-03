/**
 * @description 数据库线程池配置
 * @author cairc
 * @class DBConfigPool
 */
export class DBConfigPool {
    constructor(max, min, idle) {
        this.max = max;
        this.min = min;
        this.idle = idle;
    }
    public max: number;
    public min: number;
    public idle: number;
}