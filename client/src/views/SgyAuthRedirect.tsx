import React, {useEffect} from "react"
import {useLocation} from "react-router-dom"
import firebase from "../firebase/Firebase"
import { Spinner } from 'reactstrap';
import Loading from "../components/misc/Loading";

const functions = firebase.functions


const SgyAuthRedirect = () => {
    // Search params handling
    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const origin = searchParams.get("origin");


    useEffect(() => {
        const oauth_token = searchParams.get("oauth_token");
        const sgyauthfunction = functions.httpsCallable("sgyauth");

        sgyauthfunction({oauth_token: oauth_token}).then((res) =>{
            if(res.data) {
                window.location.href = `${origin}?modal=sgyauth`
            } else {
                window.location.href = origin ?? '/';
            }
        })
    }, [])

    return (
        <Loading message={'Preparing to redirect you...'} />
    )
}

export default SgyAuthRedirect