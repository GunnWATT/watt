export default function About() {
    return (
        <>
            <h1 className="mb-4">About</h1>
            <section className="bg-content-secondary dark:bg-background font-light rounded-md mb-4 px-8 py-16">
                <p className="text-xl mb-4">
                    If I have seen further, it is by standing on the shoulders of giants.
                </p>
                <em className="text-secondary">―Isaac Newton</em>
            </section>

            <p className="mb-4">
                <strong>Gunn WATT</strong> is a Gunn App and UGWA successor that uses a React.js frontend and Firebase backend.
                Unlike our competitors, we are open to contribution from everyone.
                Check out our source code on GitHub <a href="https://github.com/GunnWATT/watt" target="_blank" rel="noopener noreferrer">here</a>!
                Contribute by <a href="https://github.com/GunnWATT/watt/compare" target="_blank" rel="noopener noreferrer">creating a pull request</a>,{' '}
                <a href="https://github.com/GunnWATT/watt/issues/new" target="_blank" rel="noopener noreferrer">opening an issue</a>,
                or giving feedback in our <a href="https://discord.gg/4BUgdqdWfs" target="_blank" rel="noopener noreferrer">Discord server</a>;
                all opinions are welcome!
            </p>

            <p className="mb-4">
                WATT was jointly created by <a href="https://github.com/ky28059" target="_blank" rel="noopener noreferrer">Kevin</a>, who made the frontend,
                and <a href="https://github.com/ytchang05" target="_blank" rel="noopener noreferrer">Yu-Ting</a>, who originally wrote the backend.{' '}
                <a href="https://github.com/ImNotRog" target="_blank" rel="noopener noreferrer">Roger</a> helped immensely with Schoology integration,
                as well as maintaining the backend and scripts.
                Special thanks to <a href="https://github.com/mymylie" target="_blank" rel="noopener noreferrer">Mylie</a> who designed our lovely logo.
            </p>

            <p>
                Finally, this app would not have been possible without its predecessor, <a href="https://github.com/Orbiit/gunn-web-app" target="_blank" rel="noopener noreferrer">UGWA</a>.
                A large thank you to <a href="https://github.com/SheepTester" target="_blank" rel="noopener noreferrer">Sean</a>,
                for not just his mentorship and guidance but for inspiring the new generation of Gunn creators to reach
                for the stars. It is our hope that WATT can take up this mantle, inspiring the next generation of Gunn
                students to pursue their dreams in years to come.
            </p>
        </>
    );
}
