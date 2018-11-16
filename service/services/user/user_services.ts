import * as Joi from 'joi';
import {SvrResponse} from '../../../model/common/svr_context';
import { UserBusiness } from "../../../business/user_business";

export default class UserServices {

    private userBusiness: UserBusiness;

    constructor() {
        this.userBusiness = new UserBusiness();
    }

    public async register(ctx, formData) {
        const schema = Joi.object().keys({
            phone: Joi.string().required(),
            password: Joi.string().required()
        }).unknown();
        const { error } = Joi.validate(formData, schema);
        const res = new SvrResponse();
        if (error) {
            res.code = -1;
            res.display = '参数错误';
            return res;
        }

        const user = await this.userBusiness.checkUserIsExist(formData);

        if (user) {
            res.code = -1;
            res.display = '该用户已存在';
            return res;
        }

        return await this.userBusiness.register(ctx, formData);
    }

    public async login(ctx, formData) {
        const schema = Joi.object().keys({
            phone: Joi.string().required(),
            password: Joi.string().required()
        }).unknown();
        const { error } = Joi.validate(formData, schema);
        const res = new SvrResponse();
        if (error) {
            res.code = -1;
            res.display = '参数错误';
            return res;
        }

        const user = await this.userBusiness.checkUserIsExist(formData);
        if (user) {
            if (user.password === formData.password) {
                console.log(ctx.seesion);
                res.display = '登录成功';
                ctx.session = {userInfo: {id: user.id, phone: user.phone}};
                console.log('session:', ctx.session);
            } else {
                res.code = -1;
                res.display = '密码错误';
            }
        } else {
            res.code = -1;
            res.display = '用户名不存在，请先注册';
        }

        return res;
    }

    public async resetPwd(ctx, formData) {}
}