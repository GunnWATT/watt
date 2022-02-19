import {useEffect} from 'react';
import {useRouter} from 'next/router';

// Firebase
import {useAuth, useCallableFunctionResponse, useFunctions, useUser} from 'reactfire';
import { httpsCallable } from 'firebase/functions';

// Components
import Loading from '../../components/layout/Loading';


export default function SgyAuthRedirect() {
    // Search params handling
    const router = useRouter();
    const {origin, oauth_token} = router.query;

    // const {status, data} = useCallableFunctionResponse('sgyauth', {data: {oauth_token: oauth_token}});

    const functions = useFunctions();
    const auth = useAuth();

    useEffect(() => {
        // TODO: should we display a message when `origin` or `oauth_token` are missing or invalid?
        if (origin && typeof origin !== 'string') return;
        if (auth.currentUser) {

            const sgyAuthFunction = httpsCallable(functions, "sgyauth");
            const result = sgyAuthFunction({ oauth_token });

            result.then((data) => {
                console.log(data);

                if (data.data === false) {
                    // this is a problem.
                    // console.log(user);
                    router.push(origin ?? '/');
                } else {
                    const to = new URL(origin!);
                    to.searchParams.append('modal', 'sgyauth');
                    router.push(to);
                }
            }).catch((err) => {
                // TODO: there is a lot of `?? '/'` in this code, is origin allowed to be null?
                // If not, we should probably add that to the return condition on line 24.
                // If so, why is it asserted as non-null on line 37?
                console.error(err);
                router.push(origin ?? '/');
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
