# Gunn WATT

Gunn WATT (Web App of The Titans) is a complete revamp of UGWA, the Unofficial Gunn Web App, complete with a backend, database, Schoology integration, and many more features.

WATT can be found live at [gunnwatt.web.app](https://gunnwatt.web.app).

### Project Structure
This project was built using ReactJS and Firebase, with a backend in Cloud Functions and database using Cloud Firestore.

`/client` houses WATT's frontend, built with React (CRA)

`/functions` houses WATT's Firebase Functions backend

`/scripts` houses various scripts to fetch and update the JSONs WATT uses for clubs, staff, and alternate schedules

### Running Locally
###### These instructions assume you have a compatible version of Node installed. Install Node [here](https://nodejs.org/en/).

To run WATT's frontend locally, clone the repository, navigate into `/client`, and run `npm install` and `npm start` in command line. 
This will install the necessary NPM packages and run WATT on `localhost:3000`. Your terminal should look something like this:

![image](https://user-images.githubusercontent.com/60120929/134827865-4624533f-3d57-4522-8fdf-0498bdc2ee04.png)

Note that `npm start` uses Webpack's hot reload feature which will automatically reload `localhost:3000` when new changes
are detected in the project. There is no need to rerun the start script after changing code locally.

When running locally, WATT uses Firebase's [Emulator Suite](https://firebase.google.com/docs/emulator-suite) for ease of testing 
and to prevent writing to production databases. To run WATT's Firebase backend, set up the [Firebase CLI](https://firebase.google.com/docs/cli) then
follow the instructions [here](https://github.com/GunnWATT/watt/blob/main/functions/HowToRunEmulator.md). Running `firebase emulators:start`
in a new terminal window should start the emulator suite UI on `localhost:4001` as well as the Firestore, Functions, and Auth
emulators on other localhost ports, with the end result looking something like this:

![image](https://user-images.githubusercontent.com/60120929/134827751-de1a3398-7aa8-4138-a290-4e02e1c5c59a.png)

From the UI, you can access the emulated Firestore database as well as test functions and authentication.

### Contributing
If you have features you want to add or fixes for bugs, you can fork this repository and create a pull request with your changes.
Once your pull request is merged, your changes will automatically be deployed to the live website.

### Credits
[Yu-Ting](https://github.com/ytchang05), [Kevin](https://github.com/ky28059), and [Roger](https://github.com/ImNotRog) are the primary creators of WATT. 
Special thanks to [Sean](https://sheeptester.github.io) and the rest of the UGWA team for advice and tips along the way. 
The WATT logo was designed and created by Mylie.

Google Search and Stack Overflow helped greatly. Thanks to the Schoology API for integration with Schoology, as well as the libraries (and ReactJS and Firebase itself) that were used.

Many of the core features were inspired by [UGWA](https://github.com/Orbiit/gunn-web-app). Also thanks to those that helped in user testing and providing feedback.
