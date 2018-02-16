module.exports = (api, options) => {
  api.chainWebpack((webpackConfig) => {
    webpackConfig
      .context(api.service.context)
      .entry('app')
        .add('./src/main.js')
        .end()
      .output
        .path(api.resolve(options.outputDir))
        .filename('[name].js')
        .publicPath(options.baseUrl);
  });
};
