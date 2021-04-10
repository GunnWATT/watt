import React, { useState, useEffect } from 'react';
import { Moment } from 'moment';

// Images
import noschool1 from '../../assets/electronhw.png';
import noschool2 from '../../assets/electronmitosis.png';
import noschool3 from '../../assets/electroncoffee.png';
import noschool4 from '../../assets/electronvsepr.png';
import noschool5 from '../../assets/electronconfig.png';
import noschool6 from '../../assets/electronphasechange.png';
import noschool7 from '../../assets/electrondipole.png';
import noschool8 from '../../assets/electrongaslaws.png';
import noschool9 from '../../assets/electronactivationenergy.png';
import noschool10 from '../../assets/electronboxandpointer.png';
import noschool11 from '../../assets/electrontrumpet.png';
import noschool12 from '../../assets/electronbst.png';
import noschool13 from '../../assets/electronblochsphere.png';
import noschool14 from '../../assets/electroncell.png';
import noschool15 from '../../assets/electronhybridization.png';
import noschool16 from '../../assets/electronpedigree.png';
import noschool17 from '../../assets/electronviolin.png';


// Seeding function
// https://github.com/bryc/code/blob/master/jshash/PRNGs.md#mulberry32
// https://github.com/Orbiit/gunn-web-app/commit/479013823bb8453c51e23a936e8390f860f58840
export function mulberry32(a: number) {
    return () => {
        a |= 0
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    };
};

// Get a random no-school image
const randomImage = (millis: number): string => {
    const options = [noschool1, noschool2, noschool3, noschool4, noschool5, noschool6, noschool7, noschool8,
        noschool9, noschool10, noschool11, noschool12, noschool13, noschool14, noschool15, noschool16,
        noschool17];
    const seed = mulberry32(millis);

    // Old non-seeded random function
    /*
    let choice = Math.floor(Math.random() * (options.length - 1));
    if (choice >= prev) choice++; // Ensure no duplicates
    console.log(choice)
    */

    // UGWA technique of splitting options in two and pulling from a different pool every other day
    // to ensure no duplicate pictures
    const index =
        millis % (2 * 86400000) < 86400000
            ? // Left half (including middle)
            Math.floor(seed() * Math.ceil(options.length / 2))
            : // Right half (excluding middle)
            Math.floor(seed() * Math.floor(options.length / 2)) +
            Math.ceil(options.length / 2);

    return options[index];
};


type NoSchoolImageProps = { viewDate: Moment };
const NoSchoolImage = (props: NoSchoolImageProps) => {
    const { viewDate } = props;
    const [image, setImage] = useState<string | undefined>(undefined);

    useEffect(() => {
        const img = randomImage(viewDate.valueOf());
        setImage(img);
    }, [viewDate]);

    return (
        <img src={image} alt="Electron doodle" style={{ maxHeight: "400px", maxWidth: "600px" }} />
    );
};

export default NoSchoolImage;