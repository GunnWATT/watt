import React from 'react';
import {useState} from 'react';
import firebase from './firebase/Firebase';

const gunndb = firebase.db;

function Teacher() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const addTeacher = async e => {
        const staff = gunndb.collection("gunn").doc("staff");
        e.preventDefault();
        console.log(`Old: ${(await staff.get()).data()["email"]}`)
        const staffRef = gunndb.collection("gunn").doc("staff").set({
            name: name,
            email: email
        })
            .then(async () => console.log(`New: ${(await staff.get()).data()["email"]}`));
        setName("");
        setEmail("");
    }

    return (
        <form onSubmit={addTeacher}>
            <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={e => setName(e.target.value)}
                value = {name}
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={e => setEmail(e.target.value)}
                value = {email}
            />
            <button type="submit">Submit</button>
        </form>
    );
}
export default Teacher;
