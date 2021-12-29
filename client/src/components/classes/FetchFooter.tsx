import { useContext } from 'react';
import { Spinner } from 'reactstrap';
import moment from 'moment';

// Context
import SgyDataContext from '../../contexts/SgyDataContext';


export default function FetchFooter() {
    const { fetching, lastAttemptedFetch, lastFetched, updateSgy } = useContext(SgyDataContext);

    const cannotFetch = (lastAttemptedFetch != null && Date.now() - lastAttemptedFetch < 6 * 1000) || fetching;

    return (
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
    );
}
