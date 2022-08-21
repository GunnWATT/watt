import {MouseEventHandler} from 'react';


type ImageBoxProps = {
    src: string, header: string, caption?: string,
    onClick?: MouseEventHandler<HTMLDivElement>
};
export default function ImageBox(props: ImageBoxProps) {
    const {src, header, caption, onClick} = props;

    return (
        <div className="border border-tertiary hover:border-primary transition duration-200 rounded-xl cursor-pointer overflow-hidden max-w-lg" onClick={onClick}>
            <div className="m-4 space-y-1">
                <h2 className="text-xl font-medium">{header}</h2>
                {caption && <p className="font-light text-secondary">{caption}</p>}
            </div>
            <img className="w-full" src={src} alt={header} />
        </div>
    )
}
