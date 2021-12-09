import Picker from '../layout/Picker';
import { useScreenType } from '../../hooks/useScreenType';


export type ClassFilterProps = {
    classFilter: boolean[];
    setClassFilter: (filter: boolean[]) => void;
    classes: { name: string; color: string; period: string; }[];
};

// TODO: can we merge this with UpcomingPalette to maintain similarity with PriorityPicker?
// We wouldn't have to spread props downwards if we do; is the merged component too complex?
function ClassFilterPicker(props: ClassFilterProps & { hidden: boolean }) {
    const { classFilter, setClassFilter, classes, hidden } = props;
    const screenType = useScreenType();

    if (hidden) return null;

    const toggleFilter = (index: number) => {
        const newFilter = classFilter.map(a => a);
        newFilter[index] = !newFilter[index];
        setClassFilter(newFilter);
    }

    return (
        <div className={"upcoming-palette-picker " + screenType}>
            {classes.map((c, index) =>
                <div key={index} className="upcoming-palette-picker-class" onClick={() => toggleFilter(index)}>
                    <div
                        // TODO: see comment below about dot component extraction
                        className="upcoming-palette-picker-dot"
                        style={{
                            backgroundColor: classFilter[index] ? c.color : 'var(--content-primary)',
                            border: classFilter[index] ? '' : '2px inset var(--secondary)'
                        }}
                    >
                        {c.period}
                    </div>

                    <div>{c.name}</div>
                </div>
            )}

            <div className="upcoming-palette-footer">
                <div onClick={() => setClassFilter(Array(classFilter.length).fill(true))}>Select All</div>
                <div onClick={() => setClassFilter(Array(classFilter.length).fill(false))}>Deselect All</div>
            </div>
        </div>
    );
}

export default function ClassFilter(props: ClassFilterProps) {
    const { classFilter, setClassFilter, classes } = props;

    return (
        <Picker className="upcoming-palette-burrito">
            {(open, setOpen) => <>
                <div className="upcoming-palette" onClick={() => setOpen(!open)}>
                    {classes.map((c, index) =>
                        // TODO: we're rather inconsistent with which dots we extract as components and which we don't
                        // Much of the dot code can probably be reused across sections as a generic component with props
                        <div
                            key={index}
                            className="upcoming-palette-dot"
                            style={{
                                backgroundColor: classFilter[index] ? c.color : 'var(--content-primary)',
                                border: classFilter[index] ? '' : '2px inset var(--secondary)'
                            }}
                        />
                    )}
                </div>

                <ClassFilterPicker hidden={!open} {...props} />
            </>}
        </Picker>
    );
}
