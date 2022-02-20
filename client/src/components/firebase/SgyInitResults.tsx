import {useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Spinner, Button } from 'reactstrap';

// Components
//import Loading from '../misc/Loading'; // Doesn't mesh well with the modal

// Auth
import { useAuth, useFirestore, useFunctions, useUser } from 'reactfire';
import { httpsCallable } from 'firebase/functions';
import { updateUserData } from '../../util/firestore';


function InlineLoading() {
    return (
        <div className="sgy-loading">
            <Spinner />
            <span style={{marginLeft: '15px'}}>Fetching courses...</span>
        </div>
    )
}

function DisplayResults(props: { data: { [key: string]: [string, string] } }) {
    const {data} = props;
    return <>
        {Object.entries(data).map(([period, value]) => (
            <div key={period} className="sgy-period-burrito">
                <div className="sgy-period-number">{period}</div> {value[0]} · {value[1]}
            </div>
        ))}
    </>;
}

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
    // console.log(sgyModal);

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

    const toggle = () => {
        setSgyModal(false);
        searchParams.delete('modal'); // Delete modal param from url to prevent retrigger on page refresh
        navigate(`${pathname}${searchParams}`, {replace: true}); // Replace current instance in history stack with updated search params
    }

    const disableSchoology = async () => {
        await updateUserData('options.sgy', false, auth, firestore);
        toggle();
    }

    const enableSchoology = async () => {
        await updateUserData('options.sgy', true, auth, firestore);
        toggle();
    }

    return (
        <Modal isOpen={sgyModal} fade={false}>
            <ModalHeader>You're almost set! Just one last step remaining.</ModalHeader>
            <ModalBody>
                <span>
                    {!results ? (
                        <InlineLoading />
                    ) : confirmDisable ? (
                        <>
                            Are you sure you want to disable Schoology Integration?
                            <br />
                            <em>If there was a problem, please submit an issue on Github.</em>

                            <br />
                            <br />
                            <Button outline color="danger" onClick={() => disableSchoology()}>Yes, Disable Schoology</Button>
                        </>
                    ) : (
                        <>
                            Your periods:
                            <DisplayResults data={results.data} />
                            <em>If this does not look right, disable Schoology integration and submit an issue on Github.</em>
                        </>
                    )}
                </span>
            </ModalBody>
            <ModalFooter>
                {results && (confirmDisable ? (
                    <Button outline onClick={() => setConfirm(false)}>Take Me Back!</Button>
                ) : (<>
                    <Button outline color="danger" onClick={() => setConfirm(true)}>Disable Schoology</Button>
                    <Button outline color="success" onClick={() => enableSchoology()}>Looks Good!</Button>
                </>))}
            </ModalFooter>
        </Modal>
    )
}
