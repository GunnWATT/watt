import {ReactNode} from 'react';


// A restyled bootstrap Tab component to be wrapped by StateTab and NavTab.
type TabProps = {children: ReactNode, active: boolean, onClick?: () => void};
export default function Tab(props: TabProps) {
    const {children, active, onClick} = props;

    return (
        // TODO: think about background / foreground "content" color names
        <button className={`flex-grow cursor-pointer ${active ? 'text-theme-primary bg-[color:var(--content-primary)]' : 'text-theme-secondary bg-[color:var(--content-secondary)]'} rounded-t py-2 px-4`} onClick={onClick}>
            {children}
        </button>
    )
}
