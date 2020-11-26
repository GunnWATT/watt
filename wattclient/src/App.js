import React, {useState, useEffect} from 'react'
import {useAuthState} from "react-firebase-hooks/auth"
import {useCollectionData} from "react-firebase-hooks/firestore"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"


import logo from './watt.svg'
import './App.css'
import firebase from "./firebase/Firebase"
import {GoogleSignIn, SignOut, FirestoreInit, SgyAuth} from "./firebase/Authentication"

const auth = firebase.auth
const gunndb = firebase.firestore
const staff = gunndb.collection("gunn").doc("staff")


const Example = () => {
    const [startDate, setStartDate] = useState(new Date());
    return (
        <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
    );
}

function App() {
    const [msg, setMsg] = useState("")
    const [user] = useAuthState(auth)

    /*
    const [teacheremail, setTeacherEmail] = useState("")
    setTeacherEmail(staff.get().then(data()["email"]))
    useEffect(async () => {
    let email = (await staff.get()).data()["email"];
    }, []);
    */

    useEffect(() => {
        auth.getRedirectResult().then(r => FirestoreInit(r))
    }, [])

    useEffect(() => {
        fetch('api/').then(res => res.json()).then(data => {
            setMsg(data.content)
        })
    }, [])

    const SignInButton = () => (
        <button className="sign-in" onClick={GoogleSignIn}>Sign In</button>
    )

    const SignOutButton = () => (
        <button onClick={SignOut}>Sign Out</button>
    )

    const SgyAuthButton = () => (
        <button onClick={SgyAuth}>Schoology Authentication</button>
    )

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
            </header>
            <Example />
            {
                user ? (
                    <SignOutButton />
                ) : (
                    <SignInButton />
                )
            }
            <SgyAuthButton />
            <p>Special Message: {msg}</p>
        </div>
    );
}
export default App;

