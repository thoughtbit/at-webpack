module.exports = (api) => {
  api.chainWebpack((webpackConfig) => {
    if (process.env.NODE_ENV === 'development') {
      webpackConfig
        .devtool('cheap-module-eval-source-map')
        .output
          .publicPath('/');
    }
  });
};
