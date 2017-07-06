# `react-native-material-palette` development

The recommended way to develop `react-native-material-palette` is by cloning the repository and symlinkink it to a project using `yarn link` or `npm link`.

Follow the steps below in order to setup `react-native-material-palette` for development:

1. Clone the repository:
```bash
$ git clone https://github.com/callstack-io/react-native-material-palette.git
```

2. Install dependencies:
```bash
$ yarn # or `npm install`
```

3. Link the module:
```bash
$ yarn link # or `npm link`
```

## Using example app
4. Navigate to the example app:
```bash
cd example
```

5. Install example app dependencies:
```bash
$ yarn link # or `npm link`
```

Done. Everything is set up aleady. Run `yarn run haul -- --platform andoid` to start the development server and `react-native run-andoid` to build and start the app.

## Custom app

4. (Optional) Create a React Native project and natigate to it:
```bash
$ react-native init MyProject && cd MyProject
```

5. Link `react-native-material-palette` within the project:
```bash
$ yarn link react-native-material-palette # or `npm link react-native-material-palette`
```

6. Perform first time setup, if you haven't done it before. Instructions can be found here: [Setup guide](./SETUP.md).

# Useful `react-native-material-palette` scripts

* Watch `react-native-material-palette` repository and automatically transpile changed files:
```bash
$ yarn run build:watch # or `npm run build:watch`
```

* Lint the files and apply automatic fixes:
```bash
$ yarn run format # or `npm run format`
```

* Type check the files
```bash
$ yarn run flow # or `npm run flow`
```

* Run tests
```bash
$  yarn run jest # or `npm run jest`
```

* Lint the files, type check them and run test concurently:
```
$ yarn run test # or `npm run test`
```

# Troubleshooting

### Cannot find module `react` or `react-native`
This error might happen if you're using `haul` and have `react-native-material-palette` symlinked via `yarn link` or `npm link`. In order to fix it, you need to overwrite `webpack.haul.js` and set `resolve.symlinks` to `false`:

```diff
- module.exports = ({ platform }) => ({
+ module.exports = ({ platform }, defaults) => ({
+   ...defaults,
  entry: `./index.${platform}.js`,
+   resolve: {
+     ...defaults.resolve,
+     symlinks: false
+   }
});
```
