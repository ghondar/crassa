# :sparkles: Create React App Server Side Application
## :battery: A CLI tool to create React + Server Side with one command 

#### **This project is a fork of [Crana](https://github.com/scriptify/crana)**

:bulb: To get up and running with an application with a node.js backend and a React frontend, just execute:

```bash
yarn global add crassa
crassa init <projectName> [projectFolder]
```

...and you are ready to go!

This will equip you with all important tools you're going to need to develop powerful applications, for example __Live reaload__ for the server and the frontend out of the box.
Webpack, Babel, ESLint, StyleLint, Nodemon etc. etc., all preconfigured out of the box, so that you can focus on the important stuff!

:computer: __Now start developing!__
```bash
yarn dev
```
This will fire up the backend and the frontend development server. Just edit files under __src__ and see what happens!

:warning: Crassa is in early stage of development and may not meet all your requirements. That's why contributions of any kind are highly appreciated, as the best tools are built by communities!

## Usage
:star: Create a new crana project.
```bash
crassa init <projectName> [projectFolderName]
```
:dizzy: Concurrently starts the frontend and the backend in development mode.
```bash
yarn dev                                     
```
:books: See how many LOC you've already written.
```bash
yarn count                            
```

:mag: Executes eslint and styleling in autofix mode.

```bash
yarn lint
```
:car: Starts the project for production with server side.
```bash
yarn start                                   
```
:blue_car: Creates a production build for the frontend application.
```bash
yarn build                         
```

## Project structure
The interesting files for you are all located in the __src__ folder. The src folder has three subfolders:
- src
- server

As you can imagine, the __src__ folder contains all files for the React frontend application and the __server__ folder contains all files for the node.js backend.

## Extensions

Here (__server__ folder) you can extend universal middleware creating __preLoadState.js__ file to dispatch action from server to load initial state into redux store.

Example: (__/server/preLoadState.js__)

```javascript
import counterDuck from 'reducers/counter'

export default function(res, req, next) {
    // Get store from locals
    const { store } = res.locals
    // Dispatch a action to change initial state
    store.dispatch(counterDuck.creators.addCount())
    // Resave new store
    res.locals.store = store
    // Pass middlerware
    next()
}
```

We handle initial configuration [here](https://github.com/ghondar/crassa/blob/master/config-overrides.js) adding babel plugins ([transform-imports](https://www.npmjs.com/package/babel-plugin-transform-imports), [loadable-components](https://github.com/smooth-code/loadable-components) and [transform-react-remove-prop-types](https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types)) and webpack alias (basic alias from __package.json__) but you can extend this initial configuration adding to your root project __config-overrides.js__ file.

Example: (__/config-overrides.js__)

```javascript
const { override, addWebpackAlias, addBundleVisualizer } = require('customize-cra')

module.exports = override(
	process.env.BUNDLE_VISUALIZE == 1 && addBundleVisualizer()
)
```

## Technologies
As soon as you bootstrapped a new project, you have an application running with:

- Node.js with [Express](https://github.com/expressjs/express) backend.
- React for frontend with [Create React App v2](https://github.com/facebook/create-react-app), [Redux](https://github.com/reduxjs/redux), [Redux Saga](https://github.com/redux-saga/redux-saga) and [Extensible-Duck](https://github.com/investtools/extensible-duck).
- [React-App-Rewired](https://github.com/timarney/react-app-rewired) with [Customize-cra](https://github.com/arackaf/customize-cra) to provide a set of utilities to customize the Create React App v2.

Under the hood it uses Webpack, Babel, ESLint with a few other plugins enabling a powerful development workflow.

## Known constraints/issues

### Windows Linux Subsystem
If you're using Windows Linux Subsystem, eslint will not immediatly work. You need to edit the path under `.vscode/settings.json`.
Replace `C:/mnt/c` with `C:` and it should work.

## Contributing
Have a look at [CONTRIBUTING.md](CONTRIBUTING.md)

## Code of conduct
Have a look at [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)