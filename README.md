# Next Pack

Managed configuration for Next.js project.

Developing production-level projects requires a variety of tools and settings.  
For example, eslint, prettier, .gitignore, polyfill and etc,.  
But, You don't need to set up tools for your development environment.

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

`⚠️ caution`: For new projects, run `git init` first.  
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

## Features

When running next-pack, the local development and production environment does the following:

- Run eslint in watch mode on the terminal
- extension next.config.js (Automatically add polyfills)
- Manage settings by copying configuration files from next-pack, next-pack/root folder to project folder
  - .editorconfig
  - .eslintrc.js
  - .gitattributes
  - .prettierrc.js
  - .importsortrc.js
- .gitignore settings updated with `next-pack` version  
  Custom settings can be added
- Run import-sort and prettier when git commit via husky, lint-stated

## How it Works

The key part is to extend `next.config.js` and run it.  
In order to make sure that the user uses all the same parts as when using Next.js, I created the following:

- Read and merge `next-pack` and your `next.config.js`.
- Use `require.cache` to change the merged configuration to your `next.config.js` in memory.

This allows for the automatic loading of polyfills in separate projects without any configuration.

The `next-pack/index.js` file is implemented simply by calling `next` with the addition of the parts that `next-pack` handles.

```js
require('./src/scripts/utils/bootstrap'); // Invoking the function of next-pack
const next = require('next');

module.exports = options => {
  // pass next as is
  return next(options);
};
```

## Contributing

I'd love to have your helping hand on `next-pack`.  
please read [CONTRIBUTING.md](CONTRIBUTING.md).
