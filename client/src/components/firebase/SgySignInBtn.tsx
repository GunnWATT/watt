import {useAuth, useFunctions} from 'reactfire';
import {httpsCallable} from 'firebase/functions';


export default function SgySignInBtn() {
    const auth = useAuth();
    const functions = useFunctions();

    async function sgyAuth() {
        if (auth.currentUser) {
            const sgyAuthFunction = httpsCallable(functions, "sgyauth");
            const result = await sgyAuthFunction({oauth_token: null});

            window.location.href = `https://pausd.schoology.com/oauth/authorize?${new URLSearchParams({
                oauth_callback: new URL(`/schoology/auth/?origin=${encodeURIComponent(window.location.href)}`, window.location.href).toString(),
                oauth_token: result.data as string,
            })}`
        }
    }

    return (
        <button onClick={sgyAuth}>Authenticate Schoology</button>
        //<button onClick={SgyInit}>Initialize Schoology</button>
    )
}
