import React, {useState, useEffect} from "react";

// Components
//import Loading from '../misc/Loading'; // Doesn't mesh well with the modal

// Auth
import { useFunctions, useUser } from 'reactfire';
import { httpsCallable } from 'firebase/functions';


const SgyInitResults = () => {
    const functions = useFunctions();
    const {status, data} = useUser();

    const [results, setResults] = useState<any | null>(null);

    // Set the results to the value returned by initialization to be displayed
    useEffect(() => {
        if (status === 'error') return console.error(data);
        if (status === 'success') {
            const init = httpsCallable(functions, "sgyfetch-init");
            init().then(r => {
                console.log(r);
                setResults(r);
            });
        }
    }, [status])

    return (
        <span>
            {results
                ? JSON.stringify(results)
                : <span>Fetching Schoology, please wait...</span>}
        </span>
    )
}

export default SgyInitResults;