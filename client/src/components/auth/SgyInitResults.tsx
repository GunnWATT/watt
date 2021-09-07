import React, {useState, useEffect, useContext} from "react";
import { useLocation, useHistory } from 'react-router-dom';

// Components
//import Loading from '../misc/Loading'; // Doesn't mesh well with the modal

// Auth
import firebase from "../../firebase/Firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import SgyInit from '../../schoology/SgyInit';
import { Button, Spinner } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// Contexts
import UserDataContext from '../../contexts/UserDataContext';
import { updateUserData } from "../../firebase/updateUserData";

const auth = firebase.auth;

const InlineLoading = () => {
    return <div className={'sgy-loading'}>
        <Spinner />
        <span style={{
            marginLeft: '15px'
        }}>Fetching courses...</span>
    </div>
}

const DisplayResults = (props: {data: {[key:string]: string}}) =>{
    let arr = [];

    const data = props.data;
    for(const period in data) {
        arr.push(
            <div className={'sgy-period-burrito'}>
                <div className={'sgy-period-number'}>{period}</div> {data[period][0]} · {data[period][1]}
            </div>
        )
    }

    return <>
        {arr}
    </>
}

const SgyInitResults = () => {
    const [user, loading, error] = useAuthState(auth);
    const [results, setResults] = useState<any | null>(null);
    const [confirmDisable, setConfirm] = useState<boolean>(false);

    // Search params handling
    const { search, pathname } = useLocation();
    const { replace } = useHistory();
    const searchParams = new URLSearchParams(search);

    const [sgyModal, setSgyModal] = useState(searchParams.get('modal') === 'sgyauth');

    // Set the results to the value returned by initialization to be displayed
    useEffect(() => {
        if (!loading && sgyModal) {
            SgyInit().then(r => {
                console.log(r);
                setResults(r);
            });
        }
    }, [loading])

    const toggle = () => {
        setSgyModal(false);
        searchParams.delete('modal'); // Delete modal param from url to prevent retrigger on page refresh
        replace(`${pathname}${searchParams}`); // Replace current instance in history stack with updated search params
    }

    const disableSchoology = async () => {
        await updateUserData('options.sgy', false);
        toggle();
    }

    const enableSchoology = async () => {
        await updateUserData('options.sgy', true);
        toggle();
    }

    return (
        <Modal isOpen={sgyModal}>
            <ModalHeader>You're almost set! Just one last step remaining.</ModalHeader>
            <ModalBody>
                <span>
                    {
                        !results
                            ? <InlineLoading />
                            : confirmDisable 
                            ? <>
                                Are you sure you want to disable Schoology Integration?
                                <br />
                                <em>If there was a problem, please submit an issue on Github.</em>

                                <br />
                                <br />
                                    <Button outline color="danger" onClick={() => { disableSchoology() }}>Yes, Disable Schoology</Button>
                            </>
                            : <> 
                                Your periods:

                                <DisplayResults data={results.data} />

                                <em>If this does not look right, disable Schoology integration and submit an issue on Github.</em>
                                
                            </>
                            
                    }
                </span>
            </ModalBody>
            <ModalFooter>
                {!results ? null 
                : confirmDisable 
                ? <Button outline onClick={() => {setConfirm(false)}}>Take Me Back!</Button>
                : <>
                    <Button outline color="danger" onClick={() => {setConfirm(true)}}>Disable Schoology</Button>
                    <Button outline color="success" onClick={() => enableSchoology()}>Looks Good!</Button>
                </>}
            </ModalFooter>
        </Modal>
    )
}

export default SgyInitResults;