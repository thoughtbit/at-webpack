# Configuration

## How to config

Config via `.webpackrc`, e.g.

```js
{
  "alias": { "react": "preact-compat" }
}
```

If you like to write config in JavaScript, config in `.webpackrc.js`, e.g.

```js
module.exports = {
  alias: {
    react: 'preact-compat',
  },
}
```

## Options

|  | Default Value | Notes |
| :--- | :--- | :--- |
| entry | null |  |
| babel |  |  |
| define | {} |  |
| outputPath | null |  |
| publicPath | undefined |  |
| externals | {} |  |
| disableCSSModules | false |  |
| extraBabelIncludes | [] |  |
| extraResolveExtensions | [] |  |
| extraPostCSSPlugins | [] |  |
| extraResolveModules | [] |  |
| disableCSSSourceMap | false |  |
| devtool | false |  |
