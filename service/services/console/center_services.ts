import { CenterBusiness } from '../../../business/center_business';
import { AbstractServices } from '../abstract_services';
import { Get } from '../../../core/decorators/request_decorator';

export class CenterServices extends AbstractServices {
    private center: CenterBusiness;
    constructor() {
        super();
        this.name = 'center';
        this.center = new CenterBusiness();
    }

    public async queryAllUser(ctx, formData = {}) {
        return await this.center.queryAllUser(ctx, formData);
    }

    public async role(ctx, formData = {}) {
        return await this.center.role(ctx, formData);
    }

    public async isLogin(ctx, formData) {
        return await this.center.isLogin(ctx, formData);
    }

    public async tree(ctx, formData) {
        return await this.center.tree(ctx, formData);
    }

    @Get()
    public async queryUser(ctx, formData) {
        return await this.center.queryUser(ctx, formData);
    }

    public async uploadImg(ctx, formData) {
        console.log(formData);
        return await this.center.uploadImg(ctx, formData);
    }

    @Get()
    public async logout(ctx, formData) {
        return await this.center.logout(ctx, formData);
    }
}
