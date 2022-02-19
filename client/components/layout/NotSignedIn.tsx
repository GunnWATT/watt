// Note: with the retirement of forced sign-in for user data, perhaps this component can be deprecated too
// though it might be edited and used later for schoology data
export default function NotSignedIn() {
    return (
        <div className="WIP">
            <span>
                <h2>You are not signed in!</h2>
                <p>
                    WATT requires your google account to store user preferences and relevant data.{' '}
                    Sign in using the button on the sidebar.
                </p>
            </span>
        </div>
    )
}
