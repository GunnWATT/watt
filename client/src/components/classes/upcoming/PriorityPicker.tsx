import { useContext, useEffect, useState, useRef } from "react"
import UserDataContext from "../../../contexts/UserDataContext"
import { parsePriority } from "../functions/SgyFunctions"

export const PriorityPicker = ({priority, setPriority}:{priority: number, setPriority: (p: number)=>any} ) => {

    const userData = useContext(UserDataContext);

    const [picker, setPicker] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
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

    return <div className="priority" ref={ref}>
        <svg width={30} height={40} onClick={() => setPicker(!picker)}>
            <polygon points='0,0 0,40 15,25 30,40 30,0' fill={parsePriority(priority, userData)} />
        </svg>

        <div className="priority-picker" hidden={!picker}>
            {[0, 1, 2, 3, -1].map(p => 
                <div className="priority-picker-priority" key={p} onClick={() => setPriority(p)}>
                    <div className="priority-picker-priority-dot" style={{ 
                        backgroundColor: p === priority ? parsePriority(p, userData) : 'var(--content-primary)',
                        border: p === priority ? '' : '2px inset var(--secondary)'
                    }}>{p+1}</div>
                    <div>{p !== -1 ? `Priority ${p+1}` : 'No Priority'}</div>
                </div>
            )}
        </div>
    </div>
}