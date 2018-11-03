/**
 * @description
 * 返回码，均以 70 开头
 * @export
 * @enum {number}
 */
export enum ResponseCode {
    /**
     * 文章不存在
     */
    ARTICLE_NOT_FOUNT = 700001,

    /**
     * 课程解锁成功
     */
    COURSE_UNLOCK_SUCCESS = 700002
}