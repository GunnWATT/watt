import {ReactNode} from 'react';
import {useLocalStorageData} from '../../hooks/useLocalStorageData';
import {UserDataProvider} from '../../contexts/UserDataContext';


export default function LocalStorageUserDataProvider(props: {children: ReactNode}) {
    const data = useLocalStorageData();

    return (
        <UserDataProvider value={data}>
            {props.children}
        </UserDataProvider>
    )
}
