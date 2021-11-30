import { useState, useRef, useEffect } from "react";
import { useScreenType } from "../../../hooks/useScreenType";

export type PaletteProps = {
    classFilter: boolean[];
    setClassFilter: (filter: boolean[]) => void;
    classes: { name: string; color: string; period: string; }[];
};

export const UpcomingPalettePicker = (props: PaletteProps & { hidden: boolean }) => {
    const { classFilter, setClassFilter, classes, hidden } = props;

    const screenType = useScreenType();

    if (hidden) return null;

    const toggleFilter = (index: number) => {
        const newFilter = classFilter.map(a => a);
        newFilter[index] = !newFilter[index];
        setClassFilter(newFilter);
    }

    return <div className={"upcoming-palette-picker " + screenType} >
        {classes.map((c, index) => {
            return <div className="upcoming-palette-picker-class" onClick={() => toggleFilter(index)}>
                <div className="upcoming-palette-picker-dot"
                    style={{
                        backgroundColor: classFilter[index] ? c.color : 'var(--content-primary)',
                        border: classFilter[index] ? '' : '2px inset var(--secondary)'
                    }}
                >{c.period}</div>

                <div>{c.name}</div>
            </div>

        })}
    </div>
}

export const UpcomingPalette = (props: PaletteProps) => {
    const { classFilter, setClassFilter, classes } = props;

    const [picker, setPicker] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // closing the calendar on click outside
    // https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
    useEffect(() => {
        let handleClickOutside = (event: MouseEvent) => {
            if (ref.current && event.target instanceof Node && !(ref.current.contains(event.target))) {
                setPicker(false);
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);

    // console.log(classes);
    return <div className={"upcoming-palette-burrito"} ref={ref}>
        <div className="upcoming-palette" onClick={() => setPicker(!picker)}>
            {classes.map((c, index) => {
                return <div key={index} className="upcoming-palette-dot"
                    style={{
                        backgroundColor: classFilter[index] ? c.color : 'var(--content-primary)',
                        border: classFilter[index] ? '' : '2px inset var(--secondary)'
                    }}></div>
            })}
        </div>

        <UpcomingPalettePicker hidden={!picker} classes={props.classes} classFilter={props.classFilter} setClassFilter={props.setClassFilter} />
    </div>


}

export default UpcomingPalette;
