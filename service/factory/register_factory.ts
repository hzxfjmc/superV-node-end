import PageServices from '../services/page/page_services';
import UserServices from '../services/user/user_services';

export class RegisterFactory {
    private serList;
    constructor() {
        this.initServices();
    }
    private initServices() {
        this.serList = {};
        this.serList['page'] = new PageServices();
        this.serList['user'] = new UserServices();
    }
    public getService(name) {
        return this.serList[name];
    }
}
