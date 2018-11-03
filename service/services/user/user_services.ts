import { UserBusiness } from '../../../business/user_business';
import { AbstractServices } from '../abstract_services';

export class UserServices extends AbstractServices {
    private user: UserBusiness;
    constructor() {
        super();
        this.name = 'user';
        this.user = new UserBusiness();
    }

    public async queryStoreList(ctx, formData = {}) {
        return await this.user.queryStoreList(ctx, formData);
    }
}
