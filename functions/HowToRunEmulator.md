# How to Run the Firebase Emulator

Because the actual documentation for this is complete garbage.

Prerequisites: some understanding of the command line

## Step 1: Check Things

If you're completely new, make sure to navigate to both the `/client` and `/functions` folders to run `npm install`. Then, make sure to install Firebase CLI if you haven't already, using `npm install -g firebase-tools`.

## Step 2: Relog

I don't know if this was just me, but I had to run `firebase logout` and then `firebase login`.

## Step 3: ENV Variables

In adminInit.js, change the file to

```js
const admin = require("firebase-admin")
// const serviceAccount = require("../credentials/firebaseAdmin.json")

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
process.env.FIREBASE_FIRESTORE_EMULATOR_HOST = 'localhost:9099';

admin.initializeApp({
    // credential: admin.credential.cert(serviceAccount),
    projectId: "gunnwatt"
})

module.exports = admin
```

**It is REALLY important that you do not commit these changes.**

## Step 4: Schoology API Key

Create the folder `credentials` in the `/functions` folder, then create `schoologyAPI.json` inside that.
Visit <https://pausd.schoology.com/api> and obtain your API keys. (Make sure to keep them secret.) Then put the key and secret inside the `schoologyAPI.json` file.
Here's an example

```json
{
    "key": "hmu2a86v9qekgmg64vgyicfkj7u5t2wiee9gwxfkh",
    "secret": "8bwt4zpa6izfpapcdieni2u5g4e57w26"
}
```

## Step 5: Run Backend

Try running `firebase emulators:start` and see if it works. If it does, visit <http://localhost:4001/> and it should be working. If something went wrong, go spam ping someone idk.

## Step 6: Frontend

In the file `/client/src/firebase/Firebase.js`, replace the lines that say

```js
const firestore = firebase.firestore()
const auth = firebase.auth()
const functions = firebase.functions()
const analytics = firebase.analytics()
```

with

```js
const firestore = firebase.firestore()
firestore.settings({
    host: 'localhost:8080',
    ssl: false
})
const auth = firebase.auth()
auth.useEmulator("http://localhost:9099")
const functions = firebase.functions()
functions.useFunctionsEmulator("http://localhost:5001")
const analytics = firebase.analytics()
```

**Don't commit this change either.**

>Reminder: DO NOT commit changes in the two files `adminInit.js` and `Firebase.js`.

## Step 7: Pray.

I hate Firebase.
