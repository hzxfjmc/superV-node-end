import PageServices from '../services/page/page_services';
import UserServices from '../services/user/user_services';
import ConsoleServices from '../services/console/console_services';

export class RegisterFactory {
    private serList;
    constructor() {
        this.initServices();
    }
    private initServices() {
        this.serList = {};
        this.serList['page'] = new PageServices();
        this.serList['user'] = new UserServices();
        this.serList['console'] = new ConsoleServices();
    }
    public getService(name) {
        return this.serList[name];
    }
}
