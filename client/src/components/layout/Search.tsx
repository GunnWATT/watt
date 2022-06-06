import {ChangeEventHandler} from "react";

type SearchProps = {
    placeholder?: string,
    onChange: ChangeEventHandler<HTMLInputElement>
}
export default function Search(props: SearchProps) {
    return (
        <input
            type="search"
            className="bg-white text-black w-[min(12.5rem,_100%)] py-1 px-2.5 rounded-full border-2 border-tertiary"
            {...props}
        />
    )
}
