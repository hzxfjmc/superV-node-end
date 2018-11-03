import { ProductBusiness } from '../../../business/product_business';
import { AbstractServices } from '../abstract_services';

export class ProductServices extends AbstractServices {
    private product: ProductBusiness;
    constructor() {
        super();
        this.name = 'product';
        this.product = new ProductBusiness();
    }

    public async queryPlanType(ctx, formData = {}) {
        return await this.product.queryStoreList(ctx, formData);
    }
}
