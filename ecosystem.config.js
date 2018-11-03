module.exports = {
    /**
     * Application configuration section
     * http:// pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [
        //  production application
        {
            name: 'yyfax_cms',
            script: 'bin/server/index.js',
            env: {
                'NODE_ENV': 'production',
                'APOLLO_SERVER_URL': 'http://172.29.3.244:8080', // 配置中心服务地址
                'APOLLO_APP_ID': 'yyfax-cms', // app_id
                'CLUSTER_NAME': 'default', // clusterName
                'NAMESPACE_NAME': 'application' // namespaceName
            },
            log_date_format: 'YYYY-MM-DD HH:mm Z',
            merge_logs: true,
            instances: 4,
            exec_mode: "cluster",
            error_file: '/log/webnode/err-cms.log',
            out_file: '/log/webnode/out-cms.log'
        }
    ],

    /**
     * Deployment section
     * http://pm2.keymetrics.io/docs/usage/deployment/
     */
    deploy: {
        production: {
            user: "node",
            host: "212.83.163.1",
            ref: "origin/master",
            repo: "git@github.com:repo.git",
            path: "/var/www/production",
            "post-deploy": "npm install && pm2 startOrRestart ecosystem.config.js --env production"
        },
        dev: {
            user: "node",
            host: "212.83.163.1",
            ref: "origin/master",
            repo: "git@github.com:repo.git",
            path: "/var/www/development",
            "post-deploy": "npm install && pm2 startOrRestart ecosystem.config.js --env dev",
            env: {
                NODE_ENV: "dev"
            }
        }
    }
};
