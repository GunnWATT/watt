import { useContext } from 'react';
import {DateTime} from 'luxon';
import Loading, { Spinner } from '../layout/Loading';

// Firebase
import { useAuth, useFunctions } from 'reactfire';
import { sgyAuth } from '../firebase/SgySignInBtn';

// Context
import SgyDataContext from '../../contexts/SgyDataContext';


export default function FetchFooter() {
    const { fetching, lastAttemptedFetch, lastFetched, updateSgy } = useContext(SgyDataContext);

    const auth = useAuth();
    const functions = useFunctions();

    const cannotFetch = (lastAttemptedFetch != null && Date.now() - lastAttemptedFetch < 6 * 1000) || fetching;

    return (
        <footer className="mt-auto border-t border-tertiary dark:border-tertiary-dark divide-y divide-tertiary dark:divide-tertiary-dark">
            <div className="reauth-footer py-2 flex items-center">
                If your classes are wrong, reset Schoology.
                <button className="ml-auto rounded-md text-white bg-theme dark:bg-theme-dark" onClick={() => sgyAuth(auth, functions)}>
                    Reset
                </button>
            </div>

            <div className="fetch-footer pt-2 flex items-center">
                {fetching ? (
                    <Loading>Fetching...</Loading>
                ) : lastFetched ? (
                    <div>Schoology data last updated {DateTime.fromMillis(lastFetched).toRelative()}.</div>
                ) : (
                    <div>An error occurred.</div>
                )}

                <button
                    onClick={updateSgy}
                    disabled={cannotFetch}
                    className="fetch-footer-button ml-auto rounded-md disabled:opacity-30"
                >
                    Fetch
                </button>
            </div>
        </footer>
    );
}
