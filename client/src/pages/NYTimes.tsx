import {ArticleHeader} from '../components/layout/ArticleLayout';


export default function NYTimes() {
    return (
        <>
            <ArticleHeader>New York Times</ArticleHeader>

            <p className="max-w-prose mb-5">
                All PAUSD students have free access to a New York Times subscription. Register at the link below;
                when prompted, log in with your PAUSD email. Subscriptions have to be renewed every year.
            </p>
            <a href="https://myaccount.nytimes.com/verification/edupass" target="_blank" rel="noopener noreferrer">
                Register for an educational New York Times subscription →
            </a>
        </>
    )
}
