import {MouseEventHandler} from 'react';


type ImageBoxProps = {
    src: string,
    header: string, caption?: string,
    onClick?: MouseEventHandler
};
export default function ImageBox(props: ImageBoxProps) {
    const {src, header, caption, onClick} = props;

    return (
        <div className="border border-tertiary dark:border-tertiary-dark hover:border-primary dark:hover:border-primary-dark transition duration-200 rounded-xl cursor-pointer overflow-hidden max-w-lg" onClick={onClick}>
            <h2 className="text-xl font-medium mx-4 mt-4 mb-2">{header}</h2>
            {caption && <p className="mx-4 mb-4">{caption}</p>}
            <img className="w-full" src={src} alt={header} />
        </div>
    )
}
