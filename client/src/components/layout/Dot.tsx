import {ReactNode} from 'react';


// A generic component to render a colored dot with an optional centered label, most commonly used in `/classes`.
// This implementation uses inline styles for width and height and thus leads to slightly less ideal HTML
// output than if the dots were implemented at the source using tailwind `w-[...] h-[...]` classes, but hopefully
// ease of use makes this worth it in the end.
type DotProps = {size: number, color: string, border?: string, children?: ReactNode};
export default function Dot(props: DotProps) {
    const {size, color, border, children} = props;

    return (
        <div
            // TODO: is this children check really necessary or neater than potentially redundant `display: flex`?
            className={'rounded-full flex-none' + (children !== undefined ? ' flex items-center justify-center' : '')}
            style={{width: size, height: size, backgroundColor: color, border}}
        >
            {children}
        </div>
    )
}
