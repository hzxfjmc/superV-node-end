import UserInfo from '../model/user_info';
import LevelInfo from '../model/level_info';
import {SvrResponse} from "../model/common/svr_context";

export class UserBusiness {

    public async register(ctx, formData) {
        const res = new SvrResponse();
        try {
            await UserInfo.create(formData);
            res.display = '注册成功';
        } catch (e) {
            res.code = -1;
            res.display = '注册失败，请重试';
        }
        return res;
    }

    public async checkUserIsExist(data) {
        const {phone = ''} = data;

        return await UserInfo.findOne({
            where: {
                phone
            }
        });
    }

    public async getGoodsList() {
        const res = new SvrResponse();
        res.content = await LevelInfo.findAll();
        return res;
    }

    public async getUserInfo(data) {
        const res = new SvrResponse();
        const userInfo = await UserInfo.findById(data.id);
        if (userInfo) {
            delete userInfo.password;
            res.content = {
                id: userInfo.id,
                phone: userInfo.phone,
                roleId: userInfo.roleId,

            };
        } else {
            res.code = -1;
            res.display = '该用户不存在';
        }
        return res;
    }

    public async updataUserInfo(data) {
        const res = new SvrResponse();
        try {
            await UserInfo.update(data,{
                where:{id:data.id}
            });
        } catch (e) {
            res.code = -1;
            res.display = '更新数据失败';
        }
    }

    public async logout(ctx) {
        const res = new SvrResponse();
        if (ctx.sessionId) {
           const result = await ctx.app.redisClient.del(ctx.sessionId);
           if (result) {
               res.display = '退出成功';
           } else {
               res.code = -1;
               res.display = '退出失败';
           }
        }
        return res;
    }

}