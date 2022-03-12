import {useEffect, useRef, useState} from 'react';


// Higher order Picker component for reuse of "close on click outside" logic.
// Uses render props to expose `open` and `setOpen` to child elements
// TODO: replace all usages of this with headless-ui's `Popover` and delete this
type PickerProps = {
    className?: string,
    children: (open: boolean, setOpen: (state: boolean) => void) => JSX.Element
};
export default function Picker(props: PickerProps) {
    const {className, children} = props;

    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close the Picker on click outside
    // https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
    useEffect(() => {
        let handleClickOutside = (event: MouseEvent) => {
            if (ref.current && event.target instanceof Node && !(ref.current.contains(event.target))) {
                setOpen(false);
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);

    return (
        <div ref={ref} className={className}>
            {children(open, setOpen)}
        </div>
    );
}
