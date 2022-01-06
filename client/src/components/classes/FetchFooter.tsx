import { useContext } from 'react';
import { Spinner } from 'reactstrap';
import moment from 'moment';

// Firebase
import { sgyAuth } from '../firebase/SgySignInBtn';
import { useAuth, useFunctions } from 'reactfire';

// Context
import SgyDataContext from '../../contexts/SgyDataContext';


export default function FetchFooter() {
    const { fetching, lastAttemptedFetch, lastFetched, updateSgy } = useContext(SgyDataContext);

    const cannotFetch = (lastAttemptedFetch != null && Date.now() - lastAttemptedFetch < 6 * 1000) || fetching;

    const auth = useAuth();
    const functions = useFunctions();

    return <>
        <div className="reauth-footer">
            If your classes are wrong, reset Schoology.
            <button onClick={() => sgyAuth(auth, functions)}>Reset</button>
        </div>
        
        <div className="fetch-footer">
            {fetching
                ? (
                    <>
                        <Spinner />
                        <div>Fetching...</div>
                    </>
                ) : lastFetched
                    ? <div>Schoology data last updated {moment(lastFetched).fromNow()}.</div>
                    : <div>An error occurred.</div>
            }
            <button onClick={updateSgy} disabled={cannotFetch} className={"fetch-footer-button" + (cannotFetch ? " disabled" : '')}>Fetch</button>
        </div>
    </>;
}
