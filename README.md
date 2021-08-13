# Next Pack

<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@repacks/next-pack">
    <img alt="" src="https://img.shields.io/npm/v/@repacks/next-pack.svg?style=for-the-badge&labelColor=000000">
  </a>
  <a aria-label="License" href="https://github.com/haydnhkim/next-pack/blob/master/LICENSE">
    <img alt="" src="https://img.shields.io/npm/l/@repacks/next-pack.svg?style=for-the-badge&labelColor=000000">
  </a>
</p>

Managed configuration for Next.js project.

Developing production-level projects requires a variety of tools and settings.  
For example, eslint, prettier, .gitignore, polyfill and etc,.

Next Pack is a package created to centralize and manage additional parts when creating or maintaining Next.js based project.

## Quick Start

### Before Setup

Check the Next.js version to use before installation.  
You must specify the version for your Next.js version.  
First install Next.js and React package. see [Manual Setup for Next.js](https://github.com/zeit/next.js#manual-setup)

```sh
npm install next react react-dom
```

or

```sh
yarn add next react react-dom
```

⚠️ **caution**: For new projects, run `git init` first.  
Since we use git hooks, the `.git` folder must exist.

#### Next Pack Setup

Install next-pack of the same major version as Next.js.

```sh
npm install @repacks/next-pack
```

or

```sh
yarn add @repacks/next-pack
```

### How to use

It is the same as [How to use Next.js](https://nextjs.org/docs#manual-setup).  
add a `scripts` to your `package.json` like this:

```json
{
  "scripts": {
    "start": "next-pack start",
    "dev": "next-pack",
    "build": "next-pack build"
  }
}
```

The same cli commands provided by Next.js are provided.

If you need a custom server and need to run it through the `server.js` file to use an express server, write the following:

```js
const express = require('express');
const next = require('@repacks/next-pack');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
```

It is designed to use `@repacks/next-pack` instead of `next`.

## configs

For custom advanced behavior of next-pack, You can use `next.config.js` in the configuration file of Next.js. Add a `nextPack` field in it.  
Take a look at the following `next.config.js` example:

```js
module.exports = {
  nextPack: {
    workspaceRoot: path.resolve(__dirname),
    eslint: {
      disable: false,
      files: [],
      restartable: 'rs',
    },
  },
};
```

#### workspaceRoot

`workspaceRoot` {String} (optional): default `workspace's root folder`

You can set the workspace's root folder as an absolute path.  
Each configuration file is created in the folder set as the workspace root.  
If not set, the project's root folder is the workspace's root folder.

#### eslint

- `eslint` {Object} (optional): default `{}`
- `eslint.disable` {Boolean} (optional): default `false`  
  turn on/off eslint execution.
- `eslint.files` {Array<string>} (optional): default `['src', 'pages', 'components', 'server']`  
  Configuration by using the [glob pattern](https://eslint.org/docs/user-guide/configuring#configuration-based-on-glob-patterns) for the files being watched.
- `eslint.restartable` {string|Boolean} (optional): default `rs`  
  next-pack does not display duplicate eslint errors in the same file even if the file is changed.  
  Whilst fixing eslint errors, if you need to print out the entire eslint error, instead of stopping and restart next-pack, you can type `rs` with a carriage return, and eslint will restart your process.  
  (inspired by nodemon)

## Features

When running next-pack, the local development and production environment does the following:

- Run eslint in watch mode on the terminal
- extension next.config.js (Automatically add polyfills)
- Manage settings by copying configuration files from next-pack, next-pack/root folder to project folder
  - .editorconfig
  - .eslintrc.js
  - .gitattributes
  - .prettierrc.js
- .gitignore settings updated with `next-pack` version  
  Custom settings can be added
- Run prettier when git commit via husky, lint-stated (required manully install)

### Using eslint

If you want to use eslint, install `eslint-config-next` and configure it as follows.

```sh
yarn add --dev eslint eslint-config-next
```

.eslintrc.js

```js
const config = require('@repacks/next-pack/config/eslint');

module.exports = {
  ...config,
  extends: ['next'],
  rules: {
    ...config.rules,
    // add custom rules
  },
};
```

### Using prettier and sort imports

If you want to use prettier, install the following packages.

```sh
yarn add --dev prettier lint-staged
```

The import sort setting is automatically added if you use the `@trivago/prettier-plugin-sort-imports` package, which is a prettier plugin.

```sh
yarn add --dev @trivago/prettier-plugin-sort-imports
```

After installing referring to [Husky install](https://typicode.github.io/husky/#/?id=automatic-recommended), set as follows in `.husky/pre-commit`.

```sh
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

## How it Works

The key part is to extend `next.config.js` and run it.  
In order to make sure that the user uses all the same parts as when using Next.js, I created the following:

- Read and merge `next-pack` and your `next.config.js`.
- Use `require.cache` to change the merged configuration to your `next.config.js` in memory.

This allows for the automatic loading of polyfills in separate projects without any configuration.

The `next-pack/index.js` file is implemented simply by calling `next` with the addition of the parts that `next-pack` handles.

## Contributing

I'd love to have your helping hand on `next-pack`.  
please read [CONTRIBUTING.md](CONTRIBUTING.md).
