import * as device from 'device';
import { UAParser } from 'ua-parser-js';
import { UserDevice } from '../../model/common/user_device';
import { AbstractEngine } from '../abstract_engine';

export class UserAgentEngine extends AbstractEngine {
    constructor() {
        super();
    }
    public decorator(app) {
        app.use(async (ctx, next) => {
            const body = ctx.request.body;
            const uaString = body.ua || '';
            const userDevice = new UserDevice();
            if (uaString) {
                userDevice.DeviceType = device(uaString).type.toUpperCase();
                const ua = new UAParser(uaString);

                userDevice.OS = ua.getOS().name;
                userDevice.OSVersion = ua.getOS().version;
                userDevice.Browser = ua.getBrowser().name;
                userDevice.BrowserVersion = ua.getBrowser().version;
                userDevice.BrowserMajor = ua.getBrowser().major;
                userDevice.CPU = ua.getCPU().architecture;
                userDevice.Engine = ua.getEngine().name;
                userDevice.EngineVersion = ua.getEngine().version;
            }
            ctx.userDevice = userDevice;

            await next();
        });
    }
}
