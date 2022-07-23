import {useEffect, useState} from 'react';


// A helper function for only rendering specific dynamic elements when a component is mounted and hydrated
// and not during static prerendering.
export function useIsMounted() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return mounted;
}
