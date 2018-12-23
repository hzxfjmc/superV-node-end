module.exports = {
    /**
     * Application configuration section
     * http:// pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [
        //  production application
        {
            name: 'super_y',
            script: 'bin/index.js',
            env: {
                'NODE_ENV': 'production',
            },
            log_date_format: 'YYYY-MM-DD HH:mm Z',
            merge_logs: true,
            instances: 1,
            exec_mode: "cluster",
            error_file: '/log/webnode/err-cms.log',
            out_file: '/log/webnode/out-cms.log'
        }
    ]
};
