import {ReactNode} from 'react';
import {useSigninCheck} from 'reactfire';
import FirebaseUserDataProvider from './FirebaseUserDataProvider';
import LocalStorageUserDataProvider from './LocalStorageUserDataProvider';


export default function CombinedUserDataProvider(props: {children: ReactNode}) {
    const { data: signInCheckResult } = useSigninCheck()
    const ParsedUserDataProvider = signInCheckResult?.signedIn ? FirebaseUserDataProvider : LocalStorageUserDataProvider;

    return (
        <ParsedUserDataProvider>
            {props.children}
        </ParsedUserDataProvider>
    )
}
