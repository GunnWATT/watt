import {useEffect} from 'react';
import {useRouter} from 'next/router';

// Firebase
import { httpsCallable } from 'firebase/functions';
import {useAuth, useCallableFunctionResponse, useFunctions, useUser} from 'reactfire';

// Components
import CenteredMessage from '../../components/layout/CenteredMessage';
import Loading from '../../components/layout/Loading';


export default function SgyAuthRedirect() {
    // Search params handling
    const { query } = useRouter();
    const {origin, oauth_token} = query;

    // const {status, data} = useCallableFunctionResponse('sgyauth', {data: {oauth_token}});

    const functions = useFunctions();
    const {status, data: user} = useUser();

    useEffect(() => {
        if (!origin || typeof origin !== 'string') return;
        if (!oauth_token || typeof oauth_token !== 'string') return;
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
                const to = new URL(origin);
                to.searchParams.append('modal', 'sgyauth');
                window.location.href = to.href;
            }
        }).catch((err) => {
            window.location.href = origin ?? '/';
            console.error(err)
        })
    }, [status]);

    // useEffect(() => {
        // if (status === 'error') {
        //     console.error('Error occurred while calling sgyauth')
        // }
        // if (status === 'success') {
        //     console.log(data);

        //     const to = new URL(origin!); to.searchParams.append('modal', 'sgyauth');
        //     // window.location.href = `${to.href}`;
        // }
    // }, [status])

    return (
        // TODO: redesign this
        <CenteredMessage>
            {(!origin || typeof origin !== 'string') ? (
                'Malformed or missing required query param `origin`.'
            ) : (!oauth_token || typeof oauth_token !== 'string') ? (
                'Malformed or missing required query param `oauth_token`.'
            ) : (status === 'error') ? (
                'You are not signed in! Please sign in and try again.'
            ) : (
                <Loading>Preparing to redirect you...</Loading>
            )}
        </CenteredMessage>
    );
}
