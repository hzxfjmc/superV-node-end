import {PageServices} from '../services/activityPage/page_services';
import {CenterServices} from '../services/console/center_services';
import {UserServices} from '../services/user/user_services';
import {ProductServices} from '../services/console/product_services';
import {FastdfsServices} from '../services/fastdfs/fastdfs_services';

export class RegisterFactory {
    private serList;
    constructor() {
        this.initServices();
    }
    private initServices() {
        this.serList = {};
        this.serList['page'] = new PageServices();
        this.serList['center'] = new CenterServices();
        this.serList['user'] = new UserServices();
        this.serList['product'] = new ProductServices();
        this.serList['file'] = new FastdfsServices();
    }
    public getService(name) {
        return this.serList[name];
    }
}
