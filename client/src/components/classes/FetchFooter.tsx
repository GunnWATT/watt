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
        <footer className="mt-auto border-t border-tertiary divide-y divide-tertiary">
            <div className="py-2 flex items-center justify-between">
                If your classes are wrong, reset Schoology.
                <button className="px-2.5 py-[3px] rounded-md text-white bg-theme transition duration-200" onClick={() => sgyAuth(auth, functions)}>
                    Reset
                </button>
            </div>

            <div className="pt-2 flex items-center justify-between">
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
                    className="px-2.5 py-[3px] rounded-md disabled:opacity-30 bg-background dark:bg-content transition duration-200"
                >
                    Fetch
                </button>
            </div>
        </footer>
    );
}
