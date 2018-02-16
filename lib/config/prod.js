module.exports = (api) => {
  api.chainWebpack((webpackConfig) => {
    if (process.env.NODE_ENV === 'production') {
      webpackConfig
        .devtool('source-map')
        .output
          .filename('js/[name].[chunkhash:8].js')
          .chunkFilename('js/[id].[chunkhash:8].js');
    }
  });
};
