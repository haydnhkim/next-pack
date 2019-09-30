## Folder structure

```
/next-pack
  /bin            - cli executable
  /client         - script files for the browser (polyfill)
  /config         - *rc related files common configuration
  /dev/next-app   - project for next-app development
  /root           - Files to copy into user project folder
  /scripts        - Files to be used by the cli command of next-pack
    /utils        - next-pack utilities files
  .miscellaneous_configuration_files
```

- Configuration files in the `/next-pack/root/*` folder are first copied to the user project folder.  
  By default, `next-pack` is used, but once cloned, it is not overwritten to allow for extended configuration.  
  I've worked on replicating those packages that must exist in the root of each project to reflect the configuration.

- Configuration files in the `/next-pack/*` folder are designed to always have final configuration in `next-pack` rather than individual configurations.  
  The `* rc.js` files look at the configuration in the`config` folder as dependencies and are designed to be expanded in the user directory.  
  These configuration files are also used for the `next-pack` project itself.

## Development environment setting

[yarn](https://yarnpkg.com/en/docs/install) is required for `next-pack` development.

`next-pack` can only be used if there is a project to add as a dependency.  
For this I have set up the `/dev/next-app` project.  
You can set the development environment with the following command.

```sh
yarn setup
```

You can now make changes as needed.  
You can check it by running a test app through `yarn dev`.  
There are functions that prevent you from recreating after initial creation. Delete the `initialized` file or comment out the check to proceed with development.

## After development

If you commit your work after development, the yarn setup will be cleaned up automatically.  
You don't have to worry about next, react and react-dom added to package.json and yarn.lock.
