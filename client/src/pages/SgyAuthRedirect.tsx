import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

// Firebase
import { httpsCallable } from 'firebase/functions';
import {useAuth, useCallableFunctionResponse, useFunctions, useUser} from 'reactfire';

// Components
import Loading from '../components/layout/Loading';


export default function SgyAuthRedirect() {
    // Search params handling
    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const origin = searchParams.get('origin');
    const oauth_token = searchParams.get('oauth_token');

    // const {status, data} = useCallableFunctionResponse('sgyauth', {data: {oauth_token}});

    const functions = useFunctions();
    const auth = useAuth();

    useEffect(() => {
        // TODO: make error boxes for if `origin` and `oauth_token` are missing
        // and if the user is not signed in
        if (auth.currentUser) {
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
        }
    }, [auth.currentUser]);

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

    return <Loading>Preparing to redirect you...</Loading>
}
