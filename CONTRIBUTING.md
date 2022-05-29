## Folder structure

```
/next-pack               - @repacks/next-pack workspace root
  /dev/next-app          - project for next-app development
  /dev/workdir           - workspace root test directory
  /packages/next-pack    - @repacks/next-pack workspace
    /bin                 - cli executable
    /config              - *rc related files common configuration
    /src                 - @repacks/next-pack source files
      /client            - script files for the browser (polyfill)
      /root              - Files to copy into user project folder
      /scripts           - Files to be used by the cli command of next-pack
        /utils           - next-pack utility files
    .miscellaneous_configuration_files
  /test                  - test files
  /utils                 - development utility files
```

- Configuration files in the `/next-pack/root/*` folder are first copied to the user project folder.  
  By default, `next-pack` is used, but once cloned, it is not overwritten to allow for extended configuration.  
  I've worked on replicating those packages that must exist in the root of each project to reflect the configuration.

- Configuration files in the `/next-pack/*` folder are designed to always have final configuration in `next-pack` rather than individual configurations.  
  The `* rc.js` files look at the configuration in the`config` folder as dependencies and are designed to be expanded in the user directory.  
  These configuration files are also used for the `next-pack` project itself.

## Development environment setting

[yarn 3](https://www.npmjs.com/package/yarn) is required for `next-pack` development.

`next-pack` can only be used if there is a project to add as a dependency.  
For this I have set up the `/dev/next-app` project.  
You can set the development environment with the following command.

```sh
yarn
```

You can now make changes as needed.  
You can check it by running a test app through `yarn dev`.  
If you want to delete the auto-generated files, run `yarn teardown`.

## After development

Auto-generated files are registered in `.gitignore` so you can commit without worry.

```sh
yarn release
```
