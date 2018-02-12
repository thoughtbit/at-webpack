const { fs } = require('memfs');

// overwrite config path and context when fs is mocked
process.env.WEB_CLI_CONTEXT = '/';
process.env.WEB_CLI_CONFIG_PATH = '/.webpackrc';

module.exports = fs;
