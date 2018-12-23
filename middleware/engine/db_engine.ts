import * as path from 'path';
import { Sequelize } from 'sequelize-typescript';
import AESHelper from '../../helper/aes_helper';
import { AbstractEngine } from '../abstract_engine';
import Role from '../../model/role';
import UserInfo from '../../model/user_info';

export class DbEngine extends AbstractEngine {
    private sequelize;
    constructor() {
        super();
    }

    public decorator(app) {

        const config = {
            ...{
                name: 'super_y',
                dialect: 'mysql',
                modelPaths: [
                    path.join(app.config.rootPath, '/model'),
                ],
                timezone: '+08:00',
                operatorsAliases: false

            },
            ...app.config.dbConfig
        };

        // if (app.config.env === 'production') {
        //     const pwd = config.password;
        //     // config.password = AESHelper.decrypt(pwd, app.config.dbConfig.encryptKey);
        // }
        const sequelize: any = new Sequelize(config);
        this.sequelize = sequelize;
        sequelize
            .authenticate()
            .then(async () => {
                app.logger.info('Connection has been established successfully.');
                // await this.init();
            })
            .catch(err => {
                app.logger.error('Unable to connect to the database:' + err);
            });

        app.sequelize = sequelize;
    }

    public async init () {
        await this.sequelize.sync({force: false});

        // 初始化管理员
        await UserInfo.create({phone: '15279169177', password: 'admin111', authEndTime: '2018-11-19', status: 1, roleId: 1});
        await Role.create({roleName: '管理员', authorize: 'all', status: 1});
        await Role.create({roleName: '用户', authorize: 'front', status: 1});
        await Role.create({roleName: '游客', authorize: 'none', status: 1});
    }
};
