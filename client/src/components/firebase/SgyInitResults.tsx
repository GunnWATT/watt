import {useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {Dialog} from '@headlessui/react';

// Components
import CenteredModal from '../layout/CenteredModal';
import OutlineButton, {ThemeOutlineButton, SuccessOutlineButton} from '../layout/OutlineButton';
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
        await updateUserData('options.sgy', false, auth, firestore).catch(() => {});
        closeDialog();
    }

    const enableSchoology = async () => {
        // hotfix: add a catch statement to prevent break when firebase malds
        // when you try to set options.sgy from true to true
        // this allows you to actually close the modal for resetting schoology
        // might be the easiest fix idk
        await updateUserData('options.sgy', true, auth, firestore).catch(() => {}); 
        closeDialog();
    }

    return (
        <CenteredModal className="relative bg-content rounded-md max-w-md p-6" isOpen={sgyModal} setIsOpen={setSgyModal}>
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
                    <em className="text-secondary mb-3">
                        If there was a problem, please submit an issue on Github.
                    </em>
                ) : (<>
                    <p>Your fetched periods:</p>
                    <div className="flex flex-col gap-1.5 my-2">
                        {/* TODO: better way to type assert this than `as {[key: string]: [string, string]}`? */}
                        {Object.entries((results.data as {[key: string]: [string, string]})).map(([period, value]) => (
                            <div key={period} className="flex items-center gap-2">
                                <span className="w-[30px] h-[30px] flex items-center justify-center bg-background rounded-full">{period}</span>
                                {value[0]} · {value[1]}
                            </div>
                        ))}
                    </div>
                    <em className="text-secondary">
                        If this does not look right, disable Schoology integration and submit an issue on Github.
                    </em>
                </>)}
            </Dialog.Description>

            <section className="flex gap-3">
                {results && (confirmDisable ? (<>
                    <ThemeOutlineButton onClick={disableSchoology}>
                        Yes, Disable Schoology
                    </ThemeOutlineButton>
                    <OutlineButton onClick={() => setConfirm(false)}>
                        Take Me Back!
                    </OutlineButton>
                </>) : (<>
                    <ThemeOutlineButton onClick={() => setConfirm(true)}>
                        Disable Schoology
                    </ThemeOutlineButton>
                    <SuccessOutlineButton onClick={enableSchoology}>
                        Looks Good!
                    </SuccessOutlineButton>
                </>))}
            </section>
        </CenteredModal>
    )
}
