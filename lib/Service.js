/**
 * https://github.com/vuejs/vue-cli
 * The MIT License (MIT)
 * Copyright (c) 2018 Yuxi Evan You
 *
 * Modified by moocss
 */

const fs = require('fs');
const path = require('path');
const debug = require('debug');
const chalk = require('chalk');
const readPkg = require('read-pkg');
const isPlainObject = require('is-plain-object');
const Config = require('webpack-chain');
const webpackMerge = require('webpack-merge');
const loadEnv = require('./utils/loadEnv');
const PluginAPI = require('./PluginAPI');
const { defaults, validate } = require('./options');

module.exports = class Service {
  constructor(context, opts = {}) {
    const { plugins, pkg, projectOptions, useBuiltIn } = opts;
    this.context = context || process.cmd();
    this.webpackChainFns = [];
    this.webpackRawConfigFns = [];
    this.pkg = this.resolvePkg(pkg);

    const userOptions = this.loadProjectOptions(projectOptions);
    this.projectOptions = Object.assign(defaults(), userOptions);

    debug('at-webpack:project-config')(this.projectOptions);

    // load base .env
    this.loadEnvConfig();

    // install plugins.
    // If there are inline plugins, they will be used instead of those
    // found in pacakge.json.
    // When useBuiltIn === false, built-in plugins are disabled. This is mostly
    // for testing.
    this.plugins = this.resolvePlugins(plugins, useBuiltIn);
    this.plugins.forEach(({ id, apply }) => {
      apply(new PluginAPI(id, this), this.projectOptions);
    });

    // apply webpack configs from project config file
    if (this.projectOptions.chainWebpack) {
      this.webpackChainFns.push(this.projectOptions.chainWebpack);
    }
    if (this.projectOptions.configureWebpack) {
      this.webpackRawConfigFns.push(this.projectOptions.configureWebpack);
    }
  }

  // 解析 package.json 配置
  resolvePkg(inlinePkg) {
    if (inlinePkg) {
      return inlinePkg;
    } else if (fs.existsSync(path.join(this.context, 'package.json'))) {
      return readPkg.sync(this.context);
    } else {
      return {};
    }
  }

  // loads environment variables from a .env file into process.env
  loadEnvConfig(mode) {
    const logger = debug('at-webpack:env');
    const basePath = path.relative(this.context, `.env${mode ? `.${mode}` : ''}`);
    const localPath = `${basePath}.local`;

    const load = (path) => {
      try {
        const result = loadEnv(path);
        logger(path, result);
      } catch (err) {
        // only ignore error if file is not found
        if (err.toString().indexOf('ENOENT') < 0) {
          error(err);
        }
      }
    };

    load(basePath);
    load(localPath);
  }

  resolvePlugins(inlinePlugins, useBuiltIn) {
    const idToPlugin = id => ({
      id: id.replace(/^.\//, 'built-in:'),
      apply: require(id),
    });

    const builtInPlugins = [
      './config/base',
      './config/css',
      './config/dev',
      './config/prod',
    ].map(idToPlugin);
    if (inlinePlugins) {
      return useBuiltIn !== false ? builtInPlugins.concat(inlinePlugins) : inlinePlugins;
    } else {
      return builtInPlugins;
    }
  }

  resolveChainableWebpackConfig() {
    const chainableConfig = new Config();
    // apply chains
    this.webpackChainFns.forEach(fn => fn(chainableConfig));
    return chainableConfig;
  }

  resolveWebpackConfig(chainableConfig = this.resolveChainableWebpackConfig()) {
    // get raw config
    let config = chainableConfig.toConfig();
    // apply raw config fns
    this.webpackRawConfigFns.forEach((fn) => {
      if (typeof fn === 'function') {
        // function with optional return value
        const res = fn(config);
        if (res) config = webpackMerge(config, res);
      } else if (fn) {
        // merge literal values
        config = webpackMerge(config, fn);
      }
    });
    return config;
  }

  // 解析 .webpackrc or .webpackrc.js 配置
  loadProjectOptions(inlineOptions) {
    let fileConfig, resolved;

    const configFile = '.webpackrc.js';
    const configPath = path.resolve(this.context, configFile);

    if (fs.existsSync(configPath)) {
      fileConfig = require(configPath);
      if (!fileConfig || typeof fileConfig !== 'object') {
        error(`Error loading ${chalk.bold(`${configFile}`)}: should export an object.`);
        fileConfig = null;
      }
    }

    if (fileConfig) {
      resolved = fileConfig;
    } else {
      resolved = inlineOptions || {};
    }

    // validate options
    validate(resolved, (msg) => {
      error(`Invalid options in ${chalk.bold(resovledFrom)}: ${msg}`);
    });

    // Merge config with current env
    if (resolved.env) {
      if (resolved.env[process.env.NODE_ENV]) {
        merge(resolved, resolved.env[process.env.NODE_ENV]);
      }
      delete resolved.env;
    }

    // Replace npm variables
    const pkgFile = path.resolve(this.context, 'package.json');
    if (Object.keys(resolved).length && fs.existsSync(pkgFile)) {
      const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf-8'));
      resolved = Object.keys(resolved).reduce((memo, key) => {
        memo[key] = replaceNpmVariables(resolved[key], pkg);
        return memo;
      }, {});
    }

    return resolved;
  }
};

function replaceNpmVariables(value, pkg) {
  if (typeof value === 'string') {
    return value
      .replace('$npm_package_name', pkg.name)
      .replace('$npm_package_version', pkg.version);
  } else {
    return value;
  }
}

function merge(oldObj, newObj) {
  for (const key in newObj) {
    if (Array.isArray(newObj[key]) && Array.isArray(oldObj[key])) {
      oldObj[key] = oldObj[key].concat(newObj[key]);
    } else if (isPlainObject(newObj[key]) && isPlainObject(oldObj[key])) {
      oldObj[key] = Object.assign(oldObj[key], newObj[key]);
    } else {
      oldObj[key] = newObj[key];
    }
  }
}
