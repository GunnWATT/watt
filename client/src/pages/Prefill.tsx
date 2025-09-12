import clubs from "@watt/shared/data/clubs";

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAnalytics, useAuth } from "reactfire";

import { logEvent } from "firebase/analytics";
import { GoogleAuthProvider, onAuthStateChanged, signInWithRedirect } from 'firebase/auth'

import CenteredMessage from "../components/layout/CenteredMessage";
import Loading from "../components/layout/Loading";

export default function Prefill() {
    const auth = useAuth();
    const analytics = useAnalytics();

    const { id } = useParams();
    const club = clubs.data[id ? parseInt(id, 36) : ''];

    useEffect(() => {
        if (!club) return;

        const unsubscribe = onAuthStateChanged(auth, user => {
            unsubscribe();

            if (!user) {
                const provider = new GoogleAuthProvider();
                provider.addScope('profile');
                provider.addScope('email');
                provider.setCustomParameters({ hd: 'pausd.us' });

                signInWithRedirect(auth, provider);
                return;
            }

            const clubInputId = {
                'Monday': '1696394268',
                'Tuesday': '1286398699',
                'Wednesday': '1790776594',
                'Thursday': '438816767',
                'Friday': '834410885'
            }[club.day.split(',')[0]];

            const prefilledData = {
                ...(clubInputId && {
                    [`entry.${clubInputId}`]: club.name,
                    ['entry.245716957']: club.day.split(',')[0]
                }),
                ...(user && {
                    ['entry.2019720537']: `950${user.email?.match(/\d+/)}`,
                    ['emailAddress']: user.email,
                    ['entry.878125936']: user.displayName
                })
            } as Record<string, string>;

            logEvent(analytics, 'prefill', { club: club.name });
            window.location.href = `https://docs.google.com/forms/d/e/1FAIpQLSf_K0HpLJBe6SlmX8feUc_xCb2_bs75MLyzf8p2N3G1QcDA8Q/viewform?${new URLSearchParams(prefilledData)}`;
        });
    }, [club]);

    return (
        <CenteredMessage>
            {!id ? (
                <p>Malformed or missing required query param <code>club</code>.</p>
            ) : !club ? (
                <p>Club not found!</p>
            ) : (
                <Loading>Preparing to redirect you...</Loading>
            )}
        </CenteredMessage>
    );
}