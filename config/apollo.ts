import * as  apollo from 'node-apollo';
import * as Logger from 'winston';

/**
 * @description
 * Apollo 配置中心
 * @author lizc
 * @class Apollo
 */
export class Apollo {
    /**
     * 配置参数
     */
    private apolloConfig: any;
    public logger: Logger.Logger;
    constructor(logger) {
        this.apolloConfig = {
            configServerUrl: process.env.APOLLO_SERVER_URL,
            appId: process.env.APOLLO_APP_ID,
            clusterName: process.env.CLUSTER_NAME,
            namespaceName: process.env.NAMESPACE_NAME
        };
        this.logger = logger;
    }
    /**
     * @description
     * 读取配置文件
     * @author lizc
     * @memberof Apollo
     */
    public async fetchApolloConfig() {
        let result = {};
        try {
            result = await apollo.remoteConfigServiceSkipCache(this.apolloConfig);
            this.logger.info('获取apollo配置成功！');
            return result;
        } catch (error) {
            this.logger.error(`获取apollo配置失败！${error}`);
            if (process.env.NODE_ENV === 'production') {
                this.logger.error(`从配置中心获取数据失败，参数：configServerUrl：${this.apolloConfig.configServerUrl} ; appId:${this.apolloConfig.appId} ; clusterName:${this.apolloConfig.clusterName} ; namespaceName:${this.apolloConfig.namespaceName} `);
                this.logger.error(error);
            } else {
                return result;
            }
        }
    }

}