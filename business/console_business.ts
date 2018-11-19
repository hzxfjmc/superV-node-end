import Role from '../model/role';
import { SvrResponse } from "../model/common/svr_context";
import * as Enum from '../model/enums';
import UserInfo from "../model/user_info";
import LevelInfo from "../model/level_info";

export class ConsoleBusiness {

    public async getRoleList(ctx, formData) {
        const res = new SvrResponse();
        const roleList = await Role.findAndCountAll();
        const dataList = roleList.rows || [];
        res.content = [];
        return res;
    }

    public async addRole(ctx, formData) {
        const res = new SvrResponse();
        try {
            await Role.create(formData);
            res.display = '添加成功';
        } catch(e) {
            res.code = -1;
            res.display = `添加失败${e}`
        }
        return res;
    }

    public async checkRoleIsExist(formData) {
        const {id} = formData;

        return await Role.findOne({
            where: {
                id
            }
        });
    }

    public async editRole(ctx, formData) {
        const res = new SvrResponse();
        const {id} = formData;
        try {
            await Role.update(formData, {where: {id}});
            res.display = '编辑成功';
        } catch(e) {
            res.code = -1;
            res.display = `编辑失败${e}`
        }
        return res;
    }

    public async delRole(formData) {
        const res = new SvrResponse();
        try {
            const role = await Role.findById(formData.id);
            if (role.status !== Enum.RoleStatus.DEL) {
                role.status = Enum.RoleStatus.DEL;
                await role.save();
            }
            res.display = '删除成功';
        } catch (e) {
            res.code = -1;
            res.display = '删除失败';
        }
        return res;
    }

    public async addUser(ctx, formData) {
        const res = new SvrResponse();
        try {
            await UserInfo.create(formData);
            res.display = '添加用户成功';
        } catch (e) {
            res.code = -1;
            res.display = '添加失败，请重试';
        }
        return res;
    }

    public async editUser(ctx, formData) {
        const res = new SvrResponse();
        try {
            await UserInfo.update(formData, {where: {id: formData.id}});
            res.display = '修改用户信息成功';
        } catch (e) {
            res.code = -1;
            res.display = '修改用户信息失败';
        }
        return res;
    }

    public async delUser(ctx, formData) {
        const res = new SvrResponse();
        try {
            await UserInfo.update({status: Enum.UserStatus.DEL}, {where: {id: formData.id}} );
            res.display = '删除用户成功';
        } catch (e) {
            res.code = -1;
            res.display = '删除用户失败';
        }
        return res;
    }

    public async userList() {}

    public async levelList() {}

    public async addLevel(ctx, formData) {
        const res = new SvrResponse();
        try {
            await LevelInfo.create(formData);
            res.display = '添加购买会员等级';
        } catch(e) {
            res.code = -1;
            res.display = '添加失败';
        }
        return res;
    }

    public async checkLevelIsExist(formData) {
        const {id} = formData;

        return await LevelInfo.findOne({
            where: {
                id
            }
        });
    }

    public async editLevel(ctx, formData) {
        const res = new SvrResponse();
        try {
            await LevelInfo.update(formData, {where: {id: formData.id}});
            res.display = '修改用户会员信息成功';
        } catch (e) {
            res.code = -1;
            res.display = '修改用户会员信息失败'
        }
        return res;
    }

    public async delLevel(ctx, formData) {
        const res = new SvrResponse();
        try {
            await LevelInfo.update({status: Enum.LevelStatus.DEL}, {where: {id: formData.id}});
            res.display = '删除用户会员信息成功';
        } catch (e) {
            res.code = -1;
            res.display = '删除用户会员信息失败';
        }
        return res;
    }

}