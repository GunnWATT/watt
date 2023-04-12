# Gunn WATT

Gunn WATT (Web App of The Titans) is a complete revamp of UGWA, the Unofficial Gunn Web App, complete with a backend, 
database, Schoology integration, and many more features.

WATT can be found live at [gunnwatt.web.app](https://gunnwatt.web.app).

## About
WATT is built using React and Firebase, with a backend in Cloud Functions and database using Cloud Firestore. This
repository is a monorepo containing nested node packages managed via npm `workspaces` and TypeScript `paths`. Within the
repository,

`/client` houses WATT's web frontend, built with Vite and React, and the native desktop app, bundled with Tauri.

`/functions` houses WATT's Firebase Functions backend.

`/scripts` houses various scripts to fetch and update the JSONs WATT uses for clubs, staff, and alternate schedules.

`/shared` houses shared data and utility functions for use in the client, functions, and scripts.

If you have bug fixes or features you want to implement, you can fork this repository and create a pull request with your changes.
All contributions are welcome!

## API
WATT exposes API endpoints for developers wishing to fetch schedules, alternates, and other data. Read the API docs 
[here](https://github.com/GunnWATT/watt/blob/main/docs/index.md).

## Running Locally
###### These instructions assume you have a compatible version of Node installed. Install Node [here](https://nodejs.org/en/).

Before running everything, install all necessary packages by running `npm install` in the root folder. This should
install all the dependencies required by the client, functions, and scripts and generate `node_modules` in each package
and at the root with the installed files.

The following sections will go over how to run each component of WATT locally.

### Client
Navigate to the client directory with `cd client`. Run `npm start` to start the vite development server on `localhost:3000`. 
Your terminal should look something like this:

![image](https://user-images.githubusercontent.com/60120929/180681967-1bc6450e-6b94-47c1-9064-5c7a45a6af05.png)
<!-- ![image](https://user-images.githubusercontent.com/60120929/161687343-4a45578b-1385-40aa-9994-fb7c45dba275.png) -->

Vite leverages `react-refresh` to perform [hot module replacement](https://vitejs.dev/guide/features.html#hot-module-replacement) 
and automatically update the development server whenever files are updated locally; there's no need to rerun `npm start` 
after editing a file.

Note that you will be unable to log in or call Firebase functions without running emulators (see next section).

### Functions
When running locally, WATT uses Firebase's [Emulator Suite](https://firebase.google.com/docs/emulator-suite) to emulate 
production databases for testing. To run emulators, first set up the [Firebase CLI](https://firebase.google.com/docs/cli).

To replace the private credentials WATT uses in production, visit <https://pausd.schoology.com/api> and obtain your own API keys
(make sure to keep them secret). In `/functions`, create a `.runtimeconfig.json` populated with the key and secret like so:
```json
{
    "schoology": {
        "key": "hmu2a86v9qekgmg64vgyicfkj7u5t2wiee9gwxfkh",
        "secret": "8bwt4zpa6izfpapcdieni2u5g4e57w26"
    }
}
```

Navigate to the functions directory with `cd functions`. Before starting the emulators (and after changing any code), 
compile the TypeScript source files with `npm run build`. **If you change the functions code, you will have to run build 
again, but this can be done concurrently while the emulator is running.**

From the functions directory, running 
```
firebase emulators:start --import ./presets
```
in a new terminal window should start the emulator suite UI on `localhost:4000` as well as the Firestore, Functions, and Auth
emulators on other localhost ports.

![image](https://user-images.githubusercontent.com/60120929/161687556-d3cd9682-fe90-4deb-9258-522895443ff6.png)

Navigating to `localhost:4000` should bring up the Emulator UI from which the emulated firestore database and auth
records can be accessed.

![image](https://user-images.githubusercontent.com/60120929/134827751-de1a3398-7aa8-4138-a290-4e02e1c5c59a.png)
![image](https://user-images.githubusercontent.com/60120929/147842158-93ef171a-c88c-4493-97ea-3d18ac7ddb22.png)
![image](https://user-images.githubusercontent.com/60120929/147842171-c012e8b8-1031-4f3c-8686-9e0cf8f10872.png)

### Tauri
To develop desktop-specific features locally, run
```shell
npm run tauri dev
```
in `/client`. This starts the Vite dev server on `localhost:3000` as usual, but also launches a desktop application
that is automatically recompiled when the Tauri project (in `/client/src-tauri`) changes.

### Scripts
Navigate to the scripts directory with `cd scripts`. WATT's scripts use `ts-node` to skip having to manually compile 
TypeScript before running, with each script having a corresponding command defined in `package.json`. Run `npm run` to 
see a list of scripts, or `npm run [name]` to execute a script.

More detailed documentation on what each script does can be found in the [scripts README](https://github.com/GunnWATT/watt/blob/main/scripts/README.md).

![image](https://user-images.githubusercontent.com/60120929/161687846-7ef1a8bb-e78a-4ea5-bf21-4738d980fa9a.png)
![image](https://user-images.githubusercontent.com/60120929/161687964-9afd773e-b12a-498f-9a14-1f8bd73cd78c.png)

## Credits
[Yu-Ting](https://github.com/ytchang05), [Kevin](https://github.com/ky28059), and [Roger](https://github.com/ImNotRog) are the primary creators of WATT. 
Special thanks to [Sean](https://sheeptester.github.io) and the rest of the UGWA team for advice and tips along the way. 
The WATT logo was designed and created by Mylie.

Google Search and Stack Overflow helped greatly. Thanks to the Schoology API for integration with Schoology, as well as the libraries (and ReactJS and Firebase itself) that were used.

Many of the core features were inspired by [UGWA](https://github.com/Orbiit/gunn-web-app). Also thanks to those that helped in user testing and providing feedback.
