import {ReactNode} from 'react';
import {useScreenType} from '../../hooks/useScreenType';

// Components
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';


// The layout for the main schedule app.
export default function AppLayout(props: {children: ReactNode}) {
    return (
        <div id="app" className="relative h-full flex flex-col md:flex-row">
            <Sidebar />

            <div id="content" className="flex-grow min-w-0 pb-16 md:pb-0">
                {props.children}
            </div>

            <BottomNav />
        </div>
    );
}
