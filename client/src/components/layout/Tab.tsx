import {ReactNode} from 'react';


// A restyled bootstrap Tab component to be wrapped by StateTab and NavTab.
type TabProps = {children: ReactNode, active: boolean, onClick?: () => void};
export default function Tab(props: TabProps) {
    const {children, active, onClick} = props;

    return (
        <button className={`flex-grow cursor-pointer ${active ? 'text-primary bg-content shadow-content' : 'text-secondary bg-content-secondary shadow-content-secondary'} shadow-[0_0.25rem] rounded-t py-2.5 px-4`} onClick={onClick}>
            {children}
        </button>
    )
}
