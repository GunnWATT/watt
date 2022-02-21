import {Link} from 'react-router-dom';
import CenteredMessage from '../components/layout/CenteredMessage';


export default function PageNotFound() {
    return (
        <div className="h-screen">
            <CenteredMessage>
                <h3 className="text-3xl font-medium">Page not found! Check your URL and try again?</h3>
                <Link to="/" className="text-xl">Go home</Link>
            </CenteredMessage>
        </div>
    )
}
