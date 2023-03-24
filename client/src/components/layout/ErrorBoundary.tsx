import {Component, ReactNode} from 'react';
import Wave from './Wave';

export default class ErrorBoundary extends Component<{children: ReactNode}, {error: Error | null}> {
    constructor(props: {children: ReactNode}) {
        super(props);
        this.state = {error: null};
    }

    static getDerivedStateFromError(error: Error) {
        return {error};
    }

    render() {
        if (this.state.error) return (
            <>
                <Wave />
                <div className="absolute inset-0 h-max mx-4 md:mx-12 lg:mx-auto my-auto rounded-lg px-8 py-6 lg:max-w-4xl bg-content-secondary shadow-2xl border-t-8 border-theme flex flex-col max-h-[90%]">
                    <h3 className="font-bold text-2xl mb-3">WATT has crashed!</h3>
                    <pre className="text-theme text-medium mb-4">
                        {this.state.error.name} {this.state.error.message}
                    </pre>
                    <pre className="text-secondary text-sm whitespace-pre-wrap break-words overflow-y-auto scrollbar-none mb-3">
                        {this.state.error.stack}
                    </pre>
                    <code className="border-t-2 border-tertiary text-secondary text-sm font-normal pt-3 mb-0.5">
                        If the above error reoccurs, please <a href="https://github.com/GunnWATT/watt/issues/new" target="_blank" rel="noopener noreferrer">file an issue on GitHub</a>{' '}
                        or report it in our <a href="https://discord.gg/4BUgdqdWfs" target="_blank" rel="noopener noreferrer">Discord server</a>.
                    </code>
                    <code className="text-sm text-secondary cursor-pointer hover:underline" onClick={() => location.reload()}>
                        → Reload the page
                    </code>
                </div>
            </>
        );

        return this.props.children;
    }
}
