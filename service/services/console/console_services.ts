import * as Joi from 'joi';
import {SvrResponse} from '../../../model/common/svr_context';
import { ConsoleBusiness } from "../../../business/console_business";
import { UserBusiness } from "../../../business/user_business";
import * as Enum from '../../../model/enums';

export default class ConsoleServices {

    private consoleBusiness: ConsoleBusiness;
    private userBusiness: UserBusiness;

    constructor() {
        this.consoleBusiness = new ConsoleBusiness();
        this.userBusiness = new UserBusiness();
    }

    // todo 登陆的password加密，可以直接密文存错
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
                res.display = '登录成功';
                ctx.session = {userInfo: {id: user.id, phone: user.phone}};
            } else {
                res.code = -1;
                res.display = '密码错误';
            }
        } else {
            res.code = -1;
            res.display = '用户名不存在，请联系管理员';
        }

        return res;
    }

    // 权限相关接口

    public async getRoleList(ctx, formData) {
        return await this.consoleBusiness.getRoleList(ctx, formData);
    }

    public async addRole(ctx, formData) {
        const res = new SvrResponse();
        const schema = Joi.object().keys({
            roleName: Joi.string().required(),
            authorize: Joi.object().required()
        }).unknown();

        const {error} = Joi.validate(formData, schema);

        if (error) {
            res.code = -1;
            res.display = '参数错误';
            return res;
        }

        return await this.consoleBusiness.addRole(ctx, formData);
    }

    public async editRole(ctx, formData) {
        const res = new SvrResponse();
        const schema = Joi.object().keys({
            id: Joi.number().required(),
            roleName: Joi.string().required(),
            authorize: Joi.object().required()
        }).unknown();

        const {error} = Joi.validate(formData, schema);

        if (error) {
            res.code = -1;
            res.display = '参数错误';
            return res;
        }

        const role = await this.consoleBusiness.checkRoleIsExist(formData);

        if (!role || role.status === Enum.RoleStatus.DEL) {
            res.code = -1;
            res.display = '该角色不存在';
            return res;
        }

        return await this.consoleBusiness.editRole(ctx, formData);
    }

    public async delRole(ctx, formData) {
        const res = new SvrResponse();
        const schema = Joi.object().keys({
            id: Joi.number().required()
        }).unknown();

        const {error} = Joi.validate(formData, schema);

        if (error) {
            res.code = -1;
            res.display = '参数错误';
            return res;
        }

        const role = await this.consoleBusiness.checkRoleIsExist(formData);

        if (!role || role.status === Enum.RoleStatus.DEL) {
            res.code = -1;
            res.display = '该角色不存在';
            return res;
        }

        return await this.consoleBusiness.delRole(formData);
    }

    // 用户相关接口
    public async addUser(ctx, formData) {
        const schema = Joi.object().keys({
            phone: Joi.string().required(),
            password: Joi.string().required(),
            roleId: Joi.number().required()
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
        }

        return await this.consoleBusiness.addUser(ctx, formData);
    }

    public async editUser(ctx, formData) {
        const schema = Joi.object().keys({
            phone: Joi.string().required(),
            password: Joi.string().required(),
            roleId: Joi.number().required(),
            id: Joi.number().required()
        }).unknown();
        const { error } = Joi.validate(formData, schema);
        const res = new SvrResponse();
        if (error) {
            res.code = -1;
            res.display = '参数错误';
            return res;
        }

        const user = await this.userBusiness.checkUserIsExist(formData);
        if (!user) {
            res.code = -1;
            res.display = '该用户不存在';
            return res;
        }
        return await this.consoleBusiness.editUser(ctx, formData);
    }

    public async delUser(ctx, formData) {
        const schema = Joi.object().keys({
            id: Joi.number().required()
        }).unknown();
        const { error } = Joi.validate(formData, schema);
        const res = new SvrResponse();
        if (error) {
            res.code = -1;
            res.display = '参数错误';
            return res;
        }
        const user = await this.userBusiness.checkUserIsExist(formData);
        if (!user || user.status === Enum.UserStatus.DEL) {
            res.code = -1;
            res.display = '该用户不存在';
            return res;
        }

        return await this.consoleBusiness.delUser(ctx, formData);
    }

    public async userList(ctx, formData) {

    }

    // 用户等级相关接口
    public async levelList() {}

    public async addLevel(ctx, formData) {
        const res = new SvrResponse();
        const schema = Joi.object().keys({
            unit: Joi.string().required(),
            term: Joi.number().required(),
            remark: Joi.string().required(),
            levelPrice: Joi.number().required()
        }).unknown();

        const { error } = Joi.validate(formData, schema);
        if (error) {
            res.code = -1;
            res.display = '参数错误';
            return res;
        }

        return await this.consoleBusiness.addLevel(ctx, formData);
    }

    public async editLevel(ctx, formData) {
        const res = new SvrResponse();
        const schema = Joi.object().keys({
            unit: Joi.string().required(),
            term: Joi.number().required(),
            remark: Joi.string().required(),
            levelPrice: Joi.number().required(),
            id: Joi.number().required()
        }).unknown();

        const { error } = Joi.validate(formData, schema);
        if (error) {
            res.code = -1;
            res.display = '参数错误';
            return res;
        }

        const level = await this.consoleBusiness.checkLevelIsExist(formData);
        if (!level || level.status === Enum.LevelStatus.DEL) {
            res.code = -1;
            res.display = '该用户等级不存在';
            return res;
        }

        return await this.consoleBusiness.editLevel(ctx, formData);
    }

    public async delLevel(ctx, formData) {
        const res = new SvrResponse();
        const schema = Joi.object().keys({
            unit: Joi.string().required(),
            term: Joi.number().required(),
            remark: Joi.string().required(),
            levelPrice: Joi.number().required(),
            id: Joi.number().required()
        }).unknown();

        const { error } = Joi.validate(formData, schema);
        if (error) {
            res.code = -1;
            res.display = '参数错误';
            return res;
        }
        const level = await this.consoleBusiness.checkLevelIsExist(formData);
        if (!level || level.status === Enum.LevelStatus.DEL) {
            res.code = -1;
            res.display = '该用户等级不存在';
            return res;
        }

        return await this.consoleBusiness.delLevel(ctx, formData);
    }
}