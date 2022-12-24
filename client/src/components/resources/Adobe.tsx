import adobe from '../../assets/adobe.png';
import creativeCloud from '../../assets/creative-cloud.png';


export default function Adobe() {
    return (
        <>
            <h1 className="text-4xl font-bold mb-5 pr-6">
                Adobe
            </h1>

            <img src={adobe} alt="Adobe" className="max-w-full rounded-lg mb-4" />
            <p className="mb-4">
                All PAUSD students have access to a free Adobe Creative Cloud subscription. Go to <a href="https://adobe.com" target="_blank" rel="noopener noreferrer">adobe.com</a>{' '}
                and sign in with your PAUSD google account. When prompted, choose to sign in with an <strong>Enterprise ID</strong>.
                Click "Open Creative Cloud" to download your adobe products of choice!
            </p>
            <img src={creativeCloud} alt="Creative cloud" className="max-w-full rounded-lg" />
        </>
    )
}
