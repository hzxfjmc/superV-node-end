// const moment = require('moment');
import * as moment from 'moment';
moment.locale('zh-cn');
/**
 * @description 时间处理封装类-基于momentJS
 * @author lizc
 * @class MomentFormat
 */
export default class MomentFormat {

    public static moment(...p) {
        return moment(...p);
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
