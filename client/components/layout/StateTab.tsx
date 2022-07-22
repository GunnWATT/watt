import Tab from './Tab';


// A state based nav tab, for when a page's subpages are on the same URL as the root and conditionally rendered using
// state rather than URLs (/clubs).
// `value` is the state value of this tab, which determines whether this tab is active as well as
// what value to set the state to when this tab is clicked.
type StateTabProps = {value: string, name: string, state: string, setState: (state: string) => void};
export default function StateTab(props: StateTabProps) {
    const {value, name, state, setState} = props;

    return (
        <Tab active={value === state} onClick={() => setState(value)}>
            {name}
        </Tab>
    )
}
