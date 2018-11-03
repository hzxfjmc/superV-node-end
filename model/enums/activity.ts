/**
 * @description
 * 活动状态
 * @export
 * @enum {number}
 */
export enum ActivityStatus {
    /**
     * 待发布
     */
    PENDING = 0,
    /**
     * 上架
     */
    SHOW = 1,
    /**
     * 下架
     */
    HIDE = 2,
    /**
     * 删除
     */
    DELETE = 3
}
