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
}