import React from "react"
import {useLocation} from "react-router-dom"
import firebase from "../firebase/Firebase"

const functions = firebase.functions

const SgyAuthRoute = async (props) => {
    const {search} = useLocation()
    const searchParams = new URLSearchParams(search)

    const oauth_token = searchParams.get("oauth_token")
    const origin = searchParams.get("origin")
    const sgyauthfunction = functions.httpsCallable("sgyauth")
    const success = await sgyauthfunction({oauth_token: oauth_token})

    if (success) {
        window.location.href = `${origin}?modal=sgyauth`
    }
}

export default SgyAuthRoute