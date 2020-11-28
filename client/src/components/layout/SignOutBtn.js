import React, {useState} from "react";
import {SignOut} from "../../firebase/Authentication";

import {LogOut} from "react-feather";
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';


const SignOutBtn = (props) => {
    const [open, setOpen] = useState(false);

    return (
        <span className={'item'}>
            <button onClick={SignOut}>
                <LogOut/>
                <span>Sign Out</span>
            </button>
            {/*
            <Modal isOpen={open} toggle={setOpen}>
                <ModalHeader toggle={setOpen}>Modal title</ModalHeader>
                <ModalBody>
                    <button onClick={SignOut}>
                        <LogOut/>
                        <span>Sign Out</span>
                    </button>
                </ModalBody>
                <ModalFooter>
                <Button color="primary" onClick={toggle}>Do Something</Button>{' '}
                  <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
            */}
        </span>
    )
}

export default SignOutBtn
