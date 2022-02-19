import {Spinner} from 'reactstrap';


export default function Loading(props: { children?: string }) {
    return (
        <div className="loading">
            <span>
                <Spinner />
                <h2>{props.children || 'Loading content...'}</h2>
            </span>
        </div>
    )
}
