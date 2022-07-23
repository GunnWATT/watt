import { useState, useEffect, useContext } from 'react';
import UserDataContext from '../../contexts/UserDataContext';

// Components
import UtilitiesLayout from '../../components/utilities/UtilitiesLayout';
import BarcodeRow from '../../components/utilities/BarcodeRow';

// Utils
import {useAuth, useFirestore} from 'reactfire';
import {updateUserData} from '../../util/firestore';
import {useIsMounted} from '../../hooks/useIsMounted';

const DEFAULT_BARCODE = '95000000'


export default function Barcode() {
    const auth = useAuth();
    const firestore = useFirestore();

    const userData = useContext(UserDataContext);
    const [barcodes, setBarcodes] = useState<[string, string][]>(JSON.parse(userData.barcodes));

    // Add a default barcode
    function addBarcode() {
        const newBarcodes: [string, string][] = [...barcodes, [`Barcode ${barcodes.length + 1}`, DEFAULT_BARCODE]];
        setBarcodes(newBarcodes);
        updateBarcodes(newBarcodes);
    }
    // Remove a barcode at an index
    function removeBarcode(i: number) {
        barcodes.splice(i, 1);
        setBarcodes([...barcodes]);
        updateBarcodes();
    }
    // Update a barcode name at an index
    function updateBarcodeName(i: number, value: string) {
        barcodes[i][0] = value;
        setBarcodes([...barcodes]);
    }
    // Update a barcode value at an index
    function updateBarcodeValue(i: number, value: string) {
        barcodes[i][1] = value;
        setBarcodes([...barcodes]);
    }
    // Update user data with changed barcodes, optionally taking in a new barcodes object if the state has not been
    // updated yet. Call this function in onBlur instead of onChange to prevent excessive writes.
    const updateBarcodes = (newBarcodes?: [string, string][]) =>
        updateUserData('barcodes', JSON.stringify(newBarcodes ?? barcodes), auth, firestore);

    // Refresh barcodes when userData changes
    useEffect(() => {
        setBarcodes(JSON.parse(userData.barcodes));
    }, [userData.barcodes])

    // The barcode of the logged in user or DEFAULT_BARCODE if the user or email is null
    const youCode = auth.currentUser?.email
        ? '950' + auth.currentUser.email.slice(2, 7)
        : DEFAULT_BARCODE;

    const mounted = useIsMounted();


    return (
        <UtilitiesLayout>
            <h1>Barcode</h1>
            <p className="secondary">
                The <strong>You</strong> barcode will be autofilled with your student ID when logged in.
                If you need to add another barcode, click <strong>ADD BARCODE</strong> below.
            </p>
            <hr />

            <BarcodeRow you name="You" code={youCode} />

            {/* TODO: does a immediate rerender on mounted cause a noticeable delay or flash in regular usage? */}
            {mounted && barcodes.map(([name, code], index) => (
                <BarcodeRow name={name} code={code}
                    // Providing a key causes the BarcodeRows to lose focus on state change for some reason
                    //key={`${name}${code}${index}`}
                    removeBarcode={removeBarcode.bind(null, index)}
                    updateBarcodeName={updateBarcodeName.bind(null, index)}
                    updateBarcodeValue={updateBarcodeValue.bind(null, index)}
                    updateBarcodes={updateBarcodes}
                />
            ))}

            <section className="w-full flex">
                <button className="px-3 py-1 mx-auto font-semibold" onClick={addBarcode}>ADD BARCODE</button>
            </section>
        </UtilitiesLayout>
    );
}
