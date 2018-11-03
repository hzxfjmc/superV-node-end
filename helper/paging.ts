/**
 * @description
 * 分页封装
 * @author lizc
 * @export
 * @class Paging
 */
export default class Paging {
    /**
     * @description
     * 构造分页对象
     * @author lizc
     * @static
     * @param {any} pageNo 当前页数
     * @param {any} pageSize 单页显示条数
     * @param {any} totalSize 总条数
     * @param {any} dataList 结果数组
     * @returns 
     * @memberof Paging
     */
    public static structure(pageNo: number = 1, pageSize: number = 10, totalSize: number, dataList: Array<any>) {
        return {
            pageNo,
            pageSize,
            totalPage: Math.ceil(totalSize / pageSize),
            totalSize,
            dataList
        };
    }
}