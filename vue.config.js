module.exports = {
    chainWebpack: config => {
        config.module
            .rule('glsl')
            .test(/\.(vs|fs|glsl)$/)
            .use('raw')
            .loader('raw-loader')
            .end()
        const svgRule = config.module.rule('svg')
        svgRule.uses.clear()
        svgRule.use('vue-svg-loader').loader('vue-svg-loader')
    },
}
