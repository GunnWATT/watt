import {useState, useEffect} from 'react';
import {Moment} from 'moment';

// Images
import noschool1 from '../../assets/electron_hw.png';
import noschool2 from '../../assets/electron_mitosis.png';
import noschool3 from '../../assets/electron_coffee.png';
import noschool4 from '../../assets/electron_vsepr.png';
import noschool5 from '../../assets/electron_config.png';
import noschool6 from '../../assets/electron_phase_change.png';
import noschool7 from '../../assets/electron_dipole.png';
import noschool8 from '../../assets/electron_gas_laws.png';
import noschool9 from '../../assets/electron_activation_energy.png';
import noschool10 from '../../assets/electron_box_and_pointer.png';
import noschool11 from '../../assets/electron_trumpet.png';
import noschool12 from '../../assets/electron_bst.png';
import noschool13 from '../../assets/electron_bloch_sphere.png';
import noschool14 from '../../assets/electron_cell.png';
import noschool15 from '../../assets/electron_hybridization.png';
import noschool16 from '../../assets/electron_pedigree.png';
import noschool17 from '../../assets/electron_violin.png';
import noschool18 from '../../assets/electron_drawing_sheet.png';
import noschool19 from '../../assets/electron_limacon.png';
import noschool20 from '../../assets/electron_bounce.gif';


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
    }
}

// Get a random no-school image
function randomImage(millis: number): string {
    const options = [
        noschool1, noschool2, noschool3, noschool4, noschool5, noschool6, noschool7, noschool8,
        noschool9, noschool10, noschool11, noschool12, noschool13, noschool14, noschool15, noschool16,
        noschool17, noschool18, noschool19, noschool20
    ];
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
            Math.ceil(options.length / 2)

    return options[index];
}


type NoSchoolImageProps = {viewDate: Moment};
export default function NoSchoolImage(props: NoSchoolImageProps) {
    const {viewDate} = props;
    const [image, setImage] = useState<string | undefined>(undefined);

    useEffect(() => {
        const img = randomImage(viewDate.valueOf());
        setImage(img);
    }, [viewDate])

    // TODO: think about a better way to do responsive resizing than the hacky max-h-[] and max-w-[] limiting
    // Perhaps we can make use of tailwind's responsive classname prefixes?
    return (
        <img
            src={image}
            alt="Electron doodle"
            className="mx-auto dark:invert dark:hue-rotate-180 max-h-[min(350px,_35vh)] max-w-[min(600px,_100%)]"
        />
    )
}
