// The fallback loading skeleton for the resources subpages.
export default function ResourcesFallback() {
    return (
        <>
            <span className="block box-content h-9 w-52 pt-1 bg-gray-300/40 dark:bg-gray-300/10 rounded-full animate-pulse mb-5" />

            <section className="max-w-prose flex flex-col gap-2 pt-1">
                <FillerText width={95} />
                <FillerText width={100} />
                <FillerText width={40} />
            </section>
        </>
    )
}

// https://github.com/ky28059/ky28059.github.io/blob/main/components/ConceptsCard.tsx#L10-L19
function FillerText(props: {width?: number}) {
    const {width = 100} = props;

    return (
        <span
            className="block h-4 bg-gray-300/40 dark:bg-gray-300/10 rounded-full animate-pulse"
            style={{width: `${width}%`}}
        />
    )
}
