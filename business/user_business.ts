import UserInfo from '../model/user_info';
import {SvrResponse} from "../model/common/svr_context";

export class UserBusiness {

    public async register(ctx, formData) {
        const res = new SvrResponse();
        formData.authEndTime = '2018-11-22 11:11:11';
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
}