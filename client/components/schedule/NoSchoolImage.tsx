import {useState, useEffect} from 'react';
import {DateTime} from 'luxon';


export const images = [
    '/electrons/electron_hw.png',
    '/electrons/electron_mitosis.png',
    '/electrons/electron_coffee.png',
    '/electrons/electron_vsepr.png',
    '/electrons/electron_config.png',
    '/electrons/electron_phase_change.png',
    '/electrons/electron_dipole.png',
    '/electrons/electron_gas_laws.png',
    '/electrons/electron_activation_energy.png',
    '/electrons/electron_box_and_pointer.png',
    '/electrons/electron_trumpet.png',
    '/electrons/electron_bst.png',
    '/electrons/electron_bloch_sphere.png',
    '/electrons/electron_cell.png',
    '/electrons/electron_hybridization.png',
    '/electrons/electron_pedigree.png',
    '/electrons/electron_violin.png',
    '/electrons/electron_drawing_sheet.png',
    '/electrons/electron_limacon.png',
    '/electrons/electron_bounce.gif',
];

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
            Math.floor(seed() * Math.ceil(images.length / 2))
            : // Right half (excluding middle)
            Math.floor(seed() * Math.floor(images.length / 2)) +
            Math.ceil(images.length / 2)

    return images[index];
}


type NoSchoolImageProps = {viewDate: DateTime};
export default function NoSchoolImage(props: NoSchoolImageProps) {
    const {viewDate} = props;
    const [image, setImage] = useState<string | undefined>(undefined);

    useEffect(() => {
        const img = randomImage(viewDate.toMillis());
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
