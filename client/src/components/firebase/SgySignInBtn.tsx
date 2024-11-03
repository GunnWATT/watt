import { useAuth, useFunctions } from 'reactfire';
import { Functions, httpsCallable } from 'firebase/functions';
import { Auth } from 'firebase/auth';
import { useState } from 'react';


export async function sgyAuth(auth: Auth, functions: Functions) {
    if (auth.currentUser) {
        const sgyAuthFunction = httpsCallable(functions, "sgyauth");
        const result = await sgyAuthFunction({ oauth_token: null });

        window.location.href = `https://pausd.schoology.com/oauth/authorize?${new URLSearchParams({
            oauth_callback: new URL(`/schoology/auth/?origin=${encodeURIComponent(window.location.href)}`, window.location.href).toString(),
            oauth_token: result.data as string,
        })}`
    }
}

export default function SgySignInBtn() {
    const auth = useAuth();
    const functions = useFunctions();

    const [loading, setLoading] = useState(false);

    return (
        <button
            onClick={() => {
                setLoading(true)
                sgyAuth(auth, functions)
            }}
            disabled={loading}
            className="rounded w-full p-5 disabled:opacity-30 bg-background shadow-lg transition duration-200"
        >
            {loading ? "Loading..." : "Authenticate Schoology"}
        </button>
    )
}
