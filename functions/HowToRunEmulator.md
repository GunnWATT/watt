# How to Run the Firebase Emulator

Because the actual documentation for this is complete garbage.

Prerequisites: some understanding of the command line

## Step 1: Check Things

If you're completely new, make sure to navigate to both the `/client` and `/functions` folders to run `npm install`. Then, make sure to install Firebase CLI if you haven't already, using `npm install -g firebase-tools`.

## Step 2: Relog

I don't know if this was just me, but I had to run `firebase logout` and then `firebase login`.

## Step 3: Schoology API Key

In the functions root directory, create `.runtimeconfig.json`.
Visit <https://pausd.schoology.com/api> and obtain your API keys. (Make sure to keep them secret.) Then put the key and secret inside the `.runtimeconfig.json` file.
Here's an example

```json
{
    "schoology": {
        "key": "hmu2a86v9qekgmg64vgyicfkj7u5t2wiee9gwxfkh",
        "secret": "8bwt4zpa6izfpapcdieni2u5g4e57w26"
    }
}
```

## Step 4: Run Backend

Try running `firebase emulators:start --import ./functions/presets` and see if it works. If it does, visit <http://localhost:4001/> and it should be working. 
If something went wrong, go spam ping someone idk.
