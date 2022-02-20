import {MouseEventHandler} from 'react';


type ImageBoxProps = {
    src: string,
    header: string, caption?: string,
    onClick?: MouseEventHandler
};
export default function ImageBox(props: ImageBoxProps) {
    const {src, header, caption, onClick} = props;

    return (
        <div className="image-box" onClick={onClick}>
            <h2>{header}</h2>
            {caption && <p>{caption}</p>}
            <img src={src} alt={header} />
        </div>
    )
}
