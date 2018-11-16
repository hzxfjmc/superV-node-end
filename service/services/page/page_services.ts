import * as Joi from 'joi';
import {SvrResponse} from '../../../model/common/svr_context';
import { PageBusiness } from '../../../business/page_business';

export default class PageServices {

    private pageBusiness: PageBusiness;

    constructor() {
        this.pageBusiness = new PageBusiness();
    }

    public async getHtmlByUrl(ctx, formData) {
        const schema = Joi.object().keys({
            url: Joi.string()
        }).unknown();
        const result = new SvrResponse();
        const {error} = Joi.validate(formData, schema);
        if (error) {
            result.code = -1;
            result.display = '参数错误';
            return result;
        }
        return await this.pageBusiness.getHtmlByUrl(ctx, formData);
    }
}