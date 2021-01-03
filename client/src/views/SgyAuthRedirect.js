import React, {useEffect, useState} from "react"
import {useLocation} from "react-router-dom"
import firebase from "../firebase/Firebase"

const functions = firebase.functions


const SgyAuthRedirect = (props) => {
    // Search params handling
    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const origin = searchParams.get("origin");


    useEffect(() => {
        const oauth_token = searchParams.get("oauth_token");
        const sgyauthfunction = functions.httpsCallable("sgyauth");

        sgyauthfunction({oauth_token: oauth_token}).then(() =>
            window.location.href = `${origin}?modal=sgyauth`
        )
    }, [])

    return (
        <span>Preparing to redirect you...</span>
    )
}

export default SgyAuthRedirect