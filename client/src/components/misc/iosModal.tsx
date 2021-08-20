
import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import share from "../../assets/iosShare.png";
import add from "../../assets/iosAdd.png";

export default () => {

    const ios = (/iPad|iPod|iPhone/).test(navigator.userAgent);

    // @ts-ignore
    const standalone:boolean = "standalone" in navigator && navigator.standalone;

    if( !(ios && !standalone) ) {
        return null;
    }

    const [modal, setModal] = useState(true);
    const toggle = () => setModal(!modal);
    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Install WATT as an App</ModalHeader>
            <ModalBody>
                <p>For a better experience, install WATT to your home screen.<br />
                    <em>(This can only be done on iOS Safari.)</em></p>

                <ol>
                    <li>Tap Share: <img src={share} style={{
                        maxWidth: "30px",
                        verticalAlign: "middle"
                    }} /></li>
                    
                    <li>Scroll down and select: <br /> 
                        <img src={add} style={{
                            maxWidth: "40px",
                            verticalAlign: "middle"
                        }} /> <strong>Add to Home Screen</strong> </li>
                    <li>Tap "Add"</li>
                </ol>
            </ModalBody>

            <ModalFooter>
                <Button outline color="danger" onClick={toggle}>No Thanks</Button>
            </ModalFooter>
        </Modal>
    )
    // return null;
}