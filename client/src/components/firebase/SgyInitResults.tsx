import {useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {Dialog} from '@headlessui/react';

// Components
import CenteredModal from '../layout/CenteredModal';
import OutlineButton, {DangerOutlineButton, SuccessOutlineButton} from '../layout/OutlineButton';
import Loading from '../layout/Loading';

// Auth
import { useAuth, useFirestore, useFunctions, useUser } from 'reactfire';
import { httpsCallable } from 'firebase/functions';
import { updateUserData } from '../../util/firestore';


export default function SgyInitResults() {
    const functions = useFunctions();
    const auth = useAuth();
    const firestore = useFirestore();
    // const {status, data} = useUser();

    const [results, setResults] = useState<any | null>(null);
    const [confirmDisable, setConfirm] = useState<boolean>(false);

    // Search params handling
    const { search, pathname } = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(search);

    const [sgyModal, setSgyModal] = useState(searchParams.get('modal') === 'sgyauth');

    // Set the results to the value returned by initialization to be displayed
    useEffect(() => {
        if (auth.currentUser && sgyModal) {
            // console.log('hey!');
            const init = httpsCallable(functions, "sgyfetch-init");
            init().then(r => {
                // console.log(r);
                setResults(r);
            });
        }
        // return (() => {console.log('I am unmounted!!!!!')});
    }, [])

    const closeDialog = () => {
        setSgyModal(false);
        searchParams.delete('modal'); // Delete modal param from url to prevent retrigger on page refresh
        navigate(`${pathname}${searchParams}`, {replace: true}); // Replace current instance in history stack with updated search params
    }

    const disableSchoology = async () => {
        await updateUserData('options.sgy', false, auth, firestore);
        closeDialog();
    }

    const enableSchoology = async () => {
        await updateUserData('options.sgy', true, auth, firestore);
        closeDialog();
    }

    return (
        <CenteredModal isOpen={sgyModal} setIsOpen={setSgyModal}>
            <div className="relative bg-content dark:bg-content-dark rounded-md max-w-md p-6">
                <Dialog.Title className="text-xl font-semibold mb-3">
                    {confirmDisable ? (
                        'Are you sure you want to disable Schoology Integration?'
                    ) : (
                        'You\'re almost set! Just one last step remaining.'
                    )}
                </Dialog.Title>

                <Dialog.Description as="section" className="mb-3">
                    {!results ? (
                        <Loading>Fetching courses...</Loading>
                    ) : confirmDisable ? (
                        <em className="secondary mb-3">
                            If there was a problem, please submit an issue on Github.
                        </em>
                    ) : (<>
                        <p>Your fetched periods:</p>
                        <div className="flex flex-col gap-1.5 my-2">
                            {/* TODO: better way to type assert this than `as {[key: string]: [string, string]}`? */}
                            {Object.entries((results.data as {[key: string]: [string, string]})).map(([period, value]) => (
                                <div key={period} className="flex items-center gap-2">
                                    <span className="w-[30px] h-[30px] flex items-center justify-center bg-background dark:bg-background-dark rounded-full">{period}</span>
                                    {value[0]} · {value[1]}
                                </div>
                            ))}
                        </div>
                        <em className="secondary">
                            If this does not look right, disable Schoology integration and submit an issue on Github.
                        </em>
                    </>)}
                </Dialog.Description>

                <section className="flex gap-3">
                    {results && (confirmDisable ? (<>
                        <DangerOutlineButton onClick={disableSchoology}>
                            Yes, Disable Schoology
                        </DangerOutlineButton>
                        <OutlineButton onClick={() => setConfirm(false)}>
                            Take Me Back!
                        </OutlineButton>
                    </>) : (<>
                        <DangerOutlineButton onClick={() => setConfirm(true)}>
                            Disable Schoology
                        </DangerOutlineButton>
                        <SuccessOutlineButton onClick={enableSchoology}>
                            Looks Good!
                        </SuccessOutlineButton>
                    </>))}
                </section>
            </div>
        </CenteredModal>
    )
}
