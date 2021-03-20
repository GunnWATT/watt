import React, {useState, useEffect} from "react";

// Components
//import Loading from '../misc/Loading'; // Doesn't mesh well with the modal

// Auth
import firebase from "../../firebase/Firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import SgyInit from '../../schoology/SgyInit';

const auth = firebase.auth;


const SgyInitResults = () => {
    const [user, loading, error] = useAuthState(auth);
    const [results, setResults] = useState<any | null>(null);

    // Set the results to the value returned by initialization to be displayed
    useEffect(() => {
        if (!loading) {
            SgyInit().then(r => {
                console.log(r);
                setResults(r);
            });
        }
    }, [loading])

    return (
        <span>
            {
                results
                    ? JSON.stringify(results)
                    : <span>Fetching Schoology, please wait...</span>
            }
        </span>
    )
}

export default SgyInitResults;