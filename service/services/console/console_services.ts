import * as Joi from 'joi';
import {SvrResponse} from '../../../model/common/svr_context';
import { ConsoleBusiness } from "../../../business/console_business";
import { UserBusiness } from "../../../business/user_business";
import { PageBusiness} from "../../../business/page_business";
import * as Enum from '../../../model/enums';
import { needLogin, permission } from '../../../core/decorators/auth_decorator';

export default class ConsoleServices {

    private consoleBusiness: ConsoleBusiness;
    private userBusiness: UserBusiness;
    private pageBusiness: PageBusiness;

    constructor() {
        this.consoleBusiness = new ConsoleBusiness();
        this.userBusiness = new UserBusiness();
        this.pageBusiness = new PageBusiness();
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
                ctx.session = {userInfo: {id: user.id, phone: user.phone, roleId: user.roleId}};
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

    public async getAuthorizeTree() {
        return await this.consoleBusiness.getAuthorizeTree();
    }

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

    public async getAllRole() {
        return await this.consoleBusiness.getAllRole();
    }

    // 用户相关接口
    @needLogin()
    @permission('admin')
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

    @needLogin()
    @permission('admin')
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

    @needLogin()
    @permission('admin')
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

    @needLogin()
    @permission('admin')
    public async userList(ctx, formData) {
        const res = new SvrResponse();
        const schema = Joi.object().keys({
            pageSize: Joi.number().required(),
            pageNo: Joi.number().required()
        }).unknown();

        const {error} = Joi.validate(formData, schema);
        if (error) {
            res.code = -1;
            res.display = '参数错误';
            return res;
        }
        return await this.consoleBusiness.userList(ctx, formData);
    }

    // 用户等级相关接口
    @needLogin()
    @permission('admin')
    public async levelList(ctx, formData) {
        const res = new SvrResponse();
        const schema = Joi.object().keys({
            pageSize: Joi.number().required(),
            pageNo: Joi.number().required()
        }).unknown();

        const {error} = Joi.validate(formData, schema);
        if (error) {
            res.code = -1;
            res.display = '参数错误';
            return res;
        }
        return await this.consoleBusiness.levelList(ctx, formData);
    }

    @needLogin()
    @permission('admin')
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

    @needLogin()
    @permission('admin')
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

    @needLogin()
    @permission('admin')
    public async delLevel(ctx, formData) {
        const res = new SvrResponse();
        const schema = Joi.object().keys({
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

    @needLogin()
    public async logout(ctx) {
        return await this.userBusiness.logout(ctx);
    }

    @needLogin()
    public async getUserInfo(ctx) {
        const {id} = ctx.session.userInfo;
        return await this.userBusiness.getUserInfo({id});
    }


    @needLogin()
    @permission('admin')
    public async articleList(ctx, formData) {
        const res = new SvrResponse();
        const schema = Joi.object().keys({
            pageSize: Joi.number().required(),
            pageNo: Joi.number().required(),
            status: Joi.number()
        }).unknown();
        const {error} = Joi.validate(formData, schema);
        if (error) {
            res.code = -1;
            res.display = '参数错误';
            return res;
        }
        formData.userId = ctx.session.userInfo.id;
        return await this.consoleBusiness.articleList(ctx, formData);
    }

    @needLogin()
    @permission('admin')
    public async delArticle(ctx, formData) {
        const res = new SvrResponse();
        const schema = Joi.object().keys({
            id: Joi.number().required(),
        }).unknown();
        const {id} = formData;
        const {error} = Joi.validate(formData, schema);
        if (error) {
            res.code = -1;
            res.display = '参数错误';
            return res;
        }
        const article = await this.pageBusiness.checkArticleExist(id);
        if (!article || article.status === Enum.ArticleStatus.DEL) {
            res.code = -1;
            res.display = '该文章不存在';
            return res;
        }
        if (article.status === Enum.ArticleStatus.DEL) {
            res.display = '更新文章状态成功';
            return res;
        }
        try {
            article.status = Enum.ArticleStatus.DEL;
            await article.save();
            res.display = '更新文章状态成功';
        } catch (e) {
            res.code = -1;
            res.display = '更新文章状态失败';
        }
        return res;
    }
    public async changeArticleStatus(ctx, formData) {
        const res = new SvrResponse();
        const schema = Joi.object().keys({
            id: Joi.number().required(),
            nextStatus: Joi.number().required().allow(3).allow(4)
        }).unknown();
        const {id, nextStatus} = formData;
        const {error} = Joi.validate(formData, schema);
        if (error) {
            res.code = -1;
            res.display = '参数错误';
            return res;
        }
        const article = await this.pageBusiness.checkArticleExist(id);
        if (!article || article.status === Enum.ArticleStatus.DEL) {
            res.code = -1;
            res.display = '该文章不存在';
            return res;
        }
        if (article.status === nextStatus) {
            res.display = '更新文章状态成功';
            return res;
        }
        try {
            article.status = nextStatus;
            await article.save();
            res.display = '更新文章状态成功';
        } catch (e) {
            res.code = -1;
            res.display = '更新文章状态失败';
        }
        return res;
    }
}