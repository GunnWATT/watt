import {ReactNode} from 'react';
import {Link} from 'react-router-dom';


export default function Articles() {
    return (
        <>
            <h1 className="mb-6">Articles</h1>
            <section className="flex flex-col gap-3">
                <ArticleCard name="New York Times" href="/articles/nytimes">
                    Instructions for how to register for a free New York Times subscription.
                </ArticleCard>
            </section>
        </>
    );
}

type ArticleCardProps = {name: string, href: string, children: ReactNode};
function ArticleCard(props: ArticleCardProps) {
    return (
        <Link to={props.href} className="flex items-center gap-4 rounded-lg shadow-md px-5 py-4 bg-gray-100 dark:bg-background-dark !text-inherit hover:no-underline">
            <h3>{props.name}</h3>
            <p className="font-light">
                {props.children}
            </p>
        </Link>
    )
}
