const { createSchema, validate } = require('./utils/validate');

const schema = createSchema(joi => joi.object({
  use: joi.string(),
  entry: joi.alternatives().try(
    joi.object(),
    joi.string(),
  ),
  outputPath: joi.object(), // output.path
  publicPath: joi.string(), // output.publicPath
  extraResolveModules: joi.array(), // resolve.modules
  extraResolveExtensions: joi.array(), // resolve.extensions
  alias: joi.object(), // resolve.alias
  browsers: joi.array().items(joi.string()),
  babel: joi.object(),
  define: joi.object(),
  disableCSSModules: joi.boolean(),
  disableCSSSourceMap: joi.boolean(),
  extraBabelPresets: joi.array(),
  extraBabelPlugins: joi.array(),
  extraPostCSSPlugins: joi.array(),
  copy: joi.boolean(),
  html: joi.boolean(),
  devtool: joi.boolean(),
  vueLoader: joi.object(),
  css: joi.object({
    modules: joi.boolean(),
    extract: joi.boolean(),
    sourceMap: joi.boolean(),
    loaderOptions: joi.object({
      sass: joi.object(),
      less: joi.object(),
      stylus: joi.object(),
    }),
  }),
  compiler: joi.boolean(),
  multipage: joi.boolean(),
  dll: joi.boolean(),
  serviceworker: joi.object(),
  env: joi.object(),
  manifest: joi.object(),
  proxy: joi.object(),
  externals: joi.object(),
}));

exports.validate = options => validate(
  options,
  schema,
  // so that plugins can make use of custom options
  { allowUnknown: true },
);

exports.defaults = () => ({
  use: null,

  // string | object | array
  entry: null,

  // Configure webpack's output.path(https://webpack.js.org/configuration/output/#output-path) property.
  outputPath: 'dist',

  // Configure webpack's output.publicPath(https://webpack.js.org/configuration/output/#output-publicpath) property.
  publicPath: undefined,

  extraResolveModules: null,
  extraResolveExtensions: null,

  // Configure webpack's resolve.alias(https://webpack.js.org/configuration/resolve/#resolve-alias) property.
  alias: {},

  // Configure browserslist(https://github.com/ai/browserslist), works on both babel-preset-env and autoprefixer.
  browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],

  //
  babel: null,

  // Pass to code through the webpack's DefinePlugin plugin,
  // the value will automatically be processed with JSON.stringify.
  define: {},

  // Disable CSS Modules，we do not recommend doing this.
  disableCSSModules: false,

  // Disable generate CSS's SourceMap.
  disableCSSSourceMap: false,

  // Define an additional list of babel presets, the formatt is Array.
  extraBabelPresets: null,

  // Define an additional list of babel plugins, the formatt is Array.
  extraBabelPlugins: null,

  //
  extraPostCSSPlugins: null,

  //
  copy: false,

  //
  html: false,

  // Configure webpack's devtool(https://webpack.js.org/configuration/devtool/) property.
  devtool: false,

  // vue-loader options
  vueLoader: {},

  //
  css: {
    // boolean | Object, extract css?
    extract: true,
    // apply css modules to CSS files that doesn't end with .module.css?
    modules: false,
    sourceMap: false,
    loaderOptions: {},
  },

  // boolean, use full build?
  compiler: false,

  // multi page
  multipage: false,

  // split vendors using autoDLLPlugin?
  // can be an explicit list of dependencies to include in the DLL chunk.
  dll: false,

  // pwa
  serviceworker: false,

  // Set specific options for certain environment. development is for dev, and production is for build.
  env: null,

  // Configure to generate manifest.json, it's option will pass to https://www.npmjs.com/package/webpack-manifest-plugin.
  manifest: null,

  // Configure the [proxy] (https://webpack.js.org/configuration/dev-server/#devserver-proxy) property of webpack-dev-server.
  proxy: null,

  // Configure webpack's [externals] (https://webpack.js.org/configuration/externals/) property.
  externals: {},
});
