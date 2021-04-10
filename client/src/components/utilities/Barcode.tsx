import React, { useState } from 'react';

const Barcode = () => {
    const [code, setCode] = useState(95000000);

    return (
        <div>
            <h1>{code}</h1>
        </div>
    );
};

export default Barcode;