import {Spinner} from 'reactstrap';


export default function Loading() {
    return (
        <div className="loading">
            <span>
                <Spinner/>
                <h2>Loading content...</h2>
            </span>
        </div>
    )
}
