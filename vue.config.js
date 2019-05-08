module.exports = {
    chainWebpack: config => {
        // GraphQL Loader
        config.module
            .rule('graphql')
            .test(/\.(vs|fs|glsl)$/)
            .use('raw')
            .loader('raw-loader')
            .end()
    },
}
