import * as UrlUtil from 'url';

export default class UtilHelper {

    public static getUrlFileType(uri: string) {
        let result = '';
        if (uri) {
            const parseUri = UrlUtil.parse(uri);
            const pathName = parseUri.pathname;
            const file = /\.([^\.]+)\/\S+$/.exec(pathName);
            if (file) {
                result = file[1] || '';
            }
        }
        return result;
    }

    public static cloneObj(ori) {

        function clone(obj) {
            let o;
            switch (typeof obj) {
                case 'undefined': break;
                case 'string': o = obj + ''; break;
                case 'number': o = obj - 0; break;
                case 'boolean': o = obj; break;
                case 'object':
                    if (obj === null) {
                        o = null;
                    } else {
                        if (obj instanceof Array) {
                            o = [];
                            for (let i = 0, len = obj.length; i < len; i++) {
                                o.push(clone(obj[i]));
                            }
                        } else {
                            o = {};
                            for (const k in obj) {
                                o[k] = clone(obj[k]);
                            }
                        }
                    }
                    break;
                default:
                    o = obj; break;
            }
            return o;
        }

        return clone(ori);
    }

    /**
     * @description 判断手机号码格式是否正确（/^1[3578][0-9]{9}|14[57][0-9]{8}$/）
     * @author cairc
     * @static
     * @param {string} phone 手机号码
     * @returns boolean
     */
    public static isPhoneNumber(phone: string) {
        let result: boolean = false;
        const phoneReg: RegExp = /^1[3578][0-9]{9}$|^14[57][0-9]{8}$/;

        if (phone) {
            result = phoneReg.test(phone);
        }
        return result;
    }

    /**
     * @description 判断邮箱格式是否正确（/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/）
     * @author cairc
     * @static
     * @param {string} email 邮箱地址
     * @returns boolean
     */
    public static isEmail(email: string) {
        let result: boolean = false;
        const emailReg: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (email) {
            result = emailReg.test(email);
        }
        return result;
    }

    /**
     * @description 数组去重（根据某个属性）
     * @author yangwend
     * @static
     * @param {Array<any>} arr
     * @param {string} attr
     * @returns
     * @memberof UtilHelper
     */
    public static removeDuplicate(arr: Array<any>, attr: string) {
        const result = []; // 返回结果
        const hash = {};
        let elem = null;
        arr.forEach(item => {
            elem = item[attr];
            if (!hash[elem]) {
                result.push(item);
                hash[elem] = true;
            }
        });
        return result;
    }

    private static handleChildList(childResourceList) {
        const map = {};
        childResourceList.forEach(item => {
            map[item.code.toLowerCase().split('_').pop()] = this.handleChildList(item.childResourceList);
        });
        return map;
    }

    public static formatterRole(res) {
        if (res.code === 0) {
            const permissionMap = {};
            const activityPage = res.content.filter(item => item.code === 'ACTIVITYPAGE')[0];
            if (activityPage) {
                permissionMap[activityPage.code.toLowerCase()] = this.handleChildList(activityPage.childResourceList)
            }
            return permissionMap;
        }
    }


}
