import React, { useState, useEffect, useContext } from 'react';
import UserDataContext from '../../contexts/UserDataContext';
import {updateUserData} from '../../firebase/updateUserData';
import BarcodeRow from './BarcodeRow';

const DEFAULT_BARCODE = '95000000'


const Barcode = () => {
    const [code, setCode] = useState(DEFAULT_BARCODE);
    const userData = useContext(UserDataContext);
    const [barcodes, setBarcodes] = useState<[string, string][]>(JSON.parse(userData.barcodes));

    // Add a default barcode
    function addBarcode() {
        const newBarcodes: [string, string][] = [...barcodes, [`Barcode ${barcodes.length + 1}`, DEFAULT_BARCODE]];
        setBarcodes(newBarcodes)
        updateUserData('barcodes', JSON.stringify(newBarcodes));
    }
    // Remove a barcode at an index
    function removeBarcode(i: number) {
        barcodes.splice(i, 1);
        setBarcodes([...barcodes]);
        updateUserData('barcodes', JSON.stringify(barcodes));
    }
    // Update a barcode name at an index
    function updateBarcodeName(i: number, value: string) {
        barcodes[i][0] = value;
        setBarcodes([...barcodes]);
        updateUserData('barcodes', JSON.stringify(barcodes));
    }
    // Update a barcode value at an index
    function updateBarcodeValue(i: number, value: string) {
        barcodes[i][1] = value;
        setBarcodes([...barcodes]);
        updateUserData('barcodes', JSON.stringify(barcodes));
    }

    // Set the "you" barcode to the proper ID
    useEffect(() => {
        setCode('950' + userData.id);
    }, [userData.id])


    return (
        <div>
            <h1>Barcode</h1>
            <hr />

            <BarcodeRow name="You" code={code} nonRemovable />
            {barcodes.map(([name, code], index) =>
                <BarcodeRow name={name} code={code}
                    removeBarcode={removeBarcode.bind(null, index)}
                    updateBarcodeName={updateBarcodeName.bind(null, index)}
                    updateBarcodeValue={updateBarcodeValue.bind(null, index)}/>)}

            <button className="barcode-add-button" onClick={addBarcode}>ADD BARCODE</button>
        </div>
    );
}

export default Barcode;