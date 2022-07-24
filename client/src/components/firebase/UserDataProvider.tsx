import {ReactNode} from 'react';
import {useSigninCheck} from 'reactfire';
import FirebaseUserDataProvider from './FirebaseUserDataProvider';
import LocalStorageUserDataProvider from './LocalStorageUserDataProvider';


export default function UserDataProvider(props: {children: ReactNode}) {
    const { data: signInCheckResult } = useSigninCheck();
    const Provider = signInCheckResult?.signedIn ? FirebaseUserDataProvider : LocalStorageUserDataProvider;

    return (
        <Provider>
            {props.children}
        </Provider>
    )
}
