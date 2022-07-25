import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

// Firebase
import { httpsCallable } from 'firebase/functions';
import {useAuth, useCallableFunctionResponse, useFunctions, useUser} from 'reactfire';

// Components
import CenteredMessage from '../components/layout/CenteredMessage';
import Loading from '../components/layout/Loading';


export default function SgyAuthRedirect() {
    // Search params handling
    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const origin = searchParams.get('origin');
    const oauth_token = searchParams.get('oauth_token');

    // const {status, data} = useCallableFunctionResponse('sgyauth', {data: {oauth_token}});

    const functions = useFunctions();
    const {status, data: user} = useUser();

    useEffect(() => {
        if (!oauth_token) return;
        if (!user) return;

        const sgyAuthFunction = httpsCallable(functions, 'sgyauth');
        const result = sgyAuthFunction({ oauth_token });

        result.then((data) => {
            console.log(data);

            if (data.data === false) {
                // this is a problem.
                window.location.href = origin ?? '/';
                // console.log(user);
            } else {
                const to = new URL(origin!);
                to.searchParams.append('modal', 'sgyauth');
                window.location.href = to.href;
            }
        }).catch((err) => {
            window.location.href = origin ?? '/';
            console.error(err)
        })
    }, [user]);

    return (
        <CenteredMessage>
            {!oauth_token ? (
                <p>Malformed or missing required query param <code>oauth_token</code>.</p>
            ) : (status === 'success' && !user) || status === 'error' ? (
                'You are not signed in! Please sign in and try again.'
            ) : (
                <Loading>Preparing to redirect you...</Loading>
            )}
        </CenteredMessage>
    );
}
