import {Spinner} from 'reactstrap';


export default function Loading(props?: { message?: string }) {
    const message = props && props.message ? props.message : `Loading content...`
    return (
        <div className="loading">
            <span>
                <Spinner/>
                <h2>{message}</h2>
            </span>
        </div>
    )
}
