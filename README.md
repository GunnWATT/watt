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

To run WATT's frontend locally, simply clone the repository, navigate into it, and type `cd client && npm install && npm start` into command line. 
This will install all the necessary packages and run WATT on `localhost:3000`.

To run WATT's Firebase backend, follow the instructions [here](https://github.com/GunnWATT/watt/blob/main/functions/HowToRunEmulator.md).
You will also have to set up the [Firebase CLI](https://firebase.google.com/docs/cli).

### Contributing
If you have features you want to add or fixes for bugs, you can fork this repository and create a pull request with your changes.
Pull requests will automatically have preview URLs generated for them to test what your changes would look like in production, and
once your pull request is merged your changes will automatically be deployed to the live website.

### Credits
[Yu-Ting](https://github.com/ytchang05), [Kevin](https://github.com/ky28059), and [Roger](https://github.com/ImNotRog) are the primary creators of WATT. 
Special thanks to [Sean](https://sheeptester.github.io) and the rest of the UGWA team for advice and tips along the way. 
The WATT logo was designed and created by Mylie.

Google Search and Stack Overflow helped greatly. Thanks to the Schoology API for integration with Schoology, as well as the libraries (and ReactJS and Firebase itself) that were used.

Many of the core features were inspired by [UGWA](https://github.com/Orbiit/gunn-web-app). Also thanks to those that helped in user testing and providing feedback.
