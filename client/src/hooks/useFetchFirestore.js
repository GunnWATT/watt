import {useRef, useState, useEffect} from 'react';

// Firestore
import firebase from '../firebase/firebase';
const gunndb = firebase.db;


export const useFetchFirestore = (doc) => {
    const cache = useRef({});
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState({});

    useEffect(() => {
        if (!doc) return;
        const fetchData = async () => {
            setStatus('fetching');
            if (cache.current[doc]) { // If there already exists a cached response
                setData(cache.current[doc]);
                setStatus('fetched');
            } else {
                let fetch = await gunndb.collection("gunn").doc(doc).get()
                setData(fetch.data()); // Is setData asynchronous? When trying to cache "data" after calling setData it always caches the previous value of data
                cache.current[doc] = fetch.data(); // Cache response
                setStatus('fetched');
            }
        };
        fetchData();
    }, [doc]);

    return [ status, data ];
};
