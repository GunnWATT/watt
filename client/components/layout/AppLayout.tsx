import {ReactNode} from 'react';
import {useScreenType} from '../../hooks/useScreenType';

// Components
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';


// The layout for the main schedule app.
export default function AppLayout(props: {children: ReactNode}) {
    const screenType = useScreenType();

    return (
        <div id="app" className="relative h-full flex flex-col md:flex-row">
            {screenType !== 'phone' && (
                // On small screens, collapse the sidebar by default
                <Sidebar forceCollapsed={screenType === 'smallScreen'} />
            )}
            <div id="content" className="flex-grow min-w-0 pb-16 md:pb-0">
                {props.children}
            </div>
            {screenType === 'phone' && (
                // On phones, display a bottom nav instead of the sidebar
                <BottomNav/>
            )}
        </div>
    );
}
