import {Spinner} from 'reactstrap';
import CenteredMessage from './CenteredMessage';


export default function Loading(props: { children?: string }) {
    return (
        <CenteredMessage>
            <span className="flex gap-4">
                <Spinner />
                <h2>{props.children || 'Loading content...'}</h2>
            </span>
        </CenteredMessage>
    )
}
