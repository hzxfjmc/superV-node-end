// const moment = require('moment');
import * as moment from 'moment';
moment.locale('zh-cn');
/**
 * @description 时间处理封装类-基于momentJS
 * @author lizc
 * @class MomentFormat
 */
export default class MomentFormat {

    /**
     * @description 返回 moment 对象
     *
     * @author lizc
     * @param {any} p
     * @returns
     * @memberof MomentFormat
     */
    public static moment(...p) {
        return moment(...p);
    }

    /**
     * @description 根据时间戳返回 YYYY-MM-DD HH:mm:ss
     * @author lizc
     * @param {any} ts 传入的时间戳，秒或毫秒
     * @returns {String}
     */
    public static fullFormatByTs(ts) {
        return this.transform(ts, 'YYYY-MM-DD HH:mm:ss');
    }

    /**
     * @description 根据时间戳返回 YYYY年MM月DD日 HH:mm
     * @author lizc
     * @param {any} ts 传入的时间戳，秒或毫秒
     * @returns {String}
     */
    public static fullLocalFormatByTs(ts) {
        return this.transform(ts, 'lll');
    }

    /**
     * @description 根据时间戳返回 YYYY-MM-DD
     * @author lizc
     * @param {any} ts 传入的时间戳，秒或毫秒
     * @returns {String}
     */
    public static dateFormatByTs(ts) {
        return this.transform(ts, 'YYYY-MM-DD');
    }

    /**
     * @description 根据时间戳返回 YYYY.MM.DD
     * @author lizc
     * @param {any} ts 传入的时间戳，秒或毫秒
     * @returns {String}
     * @memberof MomentFormat
     */
    public static dateFormatPointByTs(ts) {
        return this.transform(ts, 'YYYY.MM.DD');
    }

    /**
     * @description 根据时间戳返回 YYYY年MM月DD日
     * @author lizc
     * @param {any} ts 传入的时间戳，秒或毫秒
     * @returns {String}
     */
    public static dateFormatFullByTs(ts) {
        return this.transform(ts, 'L');
    }

    /**
     * @description根据时间戳返回 hh:mm:ss
     * @author cairc
     * @static
     * @param {*} ts 传入的时间戳，秒或毫秒
     * @returns
     * @memberof MomentFormat
     */
    public static timeFormaByTs(ts) {
        return this.transform(ts, 'LTS');
    }

    /**
     * @description 根据时间戳返回 周${n}
     * @author lizc
     * @param {any} ts 传入的时间戳，秒或毫秒
     * @returns {String}
     */
    public static getWeekByTs(ts) {
        return this.transform(ts, 'ddd');
    }

    /**
     * @description 根据时间戳返回 ${n}月
     * @author lizc
     * @param {any} ts 传入的时间戳，秒或毫秒
     * @returns {String}
     */
    public static getMonthByTs(ts) {
        return this.transform(ts, 'MMM');
    }

    /**
     * @description 格式化时间
     * @author lizc
     * @param {any} ts 时间戳 毫秒或秒
     * @param {any} type 返回格式
     * @returns {String}
     */
    public static transform(ts, type) {
        ts = this.timestampMS(ts);
        const mom = moment(ts);
        if (!mom.isValid()) {
            return '';
        }
        const result = mom.format(type);
        return result;
    }

    /**
     * @description 若时间戳单位是秒，则转化为毫秒
     * @author lizc
     * @param {any} ts 时间戳 毫秒或秒
     * @returns {Number}
     */
    public static timestampMS(ts) {
        if (new Date(ts).getFullYear() === 1970) {
            return ts * 1000;
        }
        return ts;
    }

    /**
     * @description 获取本周周一时间 YYYYMMDD
     * @author lizc
     * @static
     * @returns {string}
     */
    public static getMonday() {
        return moment().weekday(0).format('YYYYMMDD');
    }

    /**
     * @description获取本周周一时间戳
     * @author cairc
     * @static
     * @returns
     * @memberof MomentFormat
     */
    public static getMondayTS() {
        const monday = moment().weekday(0).format('YYYYMMDD');
        return moment(monday).unix();
    }

    /**
     * @description 获取当前时间 YYYYMMDD
     * @author lizc
     * @static
     * @memberof MomentFormat
     */
    public static getCurrentDate(format = 'YYYYMMDD') {
        return moment().format(format);
    }
    /**
     * @description
     * 获取当前日期时间戳，如 2018/03/20 返回 1521475200
     * @author lizc
     * @static
     * @memberof MomentFormat
     */
    public static getCurrentDateTs() {
        return moment(moment().format('YYYYMMDD')).unix();
    }
    /**
     * @description
     * 获取n天后的日期
     * @author lizc
     * @static
     * @param {number} [days=1]
     * @returns YYYYMMDD
     * @memberof MomentFormat
     */
    public static getAfterDayDate(days: number = 1) {
        return moment().add(days, 'days').format('YYYYMMDD');
    }

    /**
     * 格式化date
     * @param date
     * @param {string} format
     * @returns {string}
     */
    public static formatterDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
        return moment(date).format(format);
    }

    /**
     * 格式化当前日期，如2018-09-28T16:00:00.039Z 返回2018-09-28
     * @param date
     * @param {string} format
     * @returns {string}
     */
    public static getFormatDate(date, format = 'YYYY-MM-DD') {
        return moment(date).format(format);
    }

    /**
     * 通过moment的diff方法比较获取的时间和当前的时间差，小于等于60s显示刚刚，
     * 大于60s，小于60分钟, 显示多少分钟前，
     * 大于等于60分钟,小于24小时，显示多少小时,
     * 大于等于24小时, 显示时间，格式为YYYY-MM-DD HH:mm
     * @param target 当前时间
     * @param value 需要对比的时间
     */
    public static timeDiff(target, value, formatterRule = 'YYYY-MM-DD HH:mm') {
        let time = '';
        const currentData = moment.isMoment(target) ? target : moment(target);
        const secondsDiff = currentData.diff(MomentFormat.formatterDate(value), 'seconds');
        const minutesDiff = currentData.diff(MomentFormat.formatterDate(value), 'minutes');
        const hoursDiff = currentData.diff(MomentFormat.formatterDate(value), 'hours');
        if (secondsDiff <= 60) {
            time = '刚刚';
        } else if (secondsDiff > 60 && secondsDiff < 3600) {
            time = `${minutesDiff}分钟前`;
        } else if (secondsDiff >= 3600 && secondsDiff < 86400) {
            time = `${hoursDiff}小时前`;
        } else {
            time = this.formatterDate(value, formatterRule);
        }

        return time;
    }
}
