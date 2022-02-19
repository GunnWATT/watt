import {useState, useEffect, useContext} from 'react';
import {Moment} from 'moment';

// Contexts
import UserDataContext from '../../contexts/UserDataContext';


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

// Gets a random no-school image
function randomImage(millis: number): string {
    const options = [
        '/electrons/electronhw.png', '/electrons/electronmitosis.png', '/electrons/electroncoffee.png', '/electrons/electronvsepr.png',
        '/electrons/electronconfig.png', '/electrons/electronphasechange.png', '/electrons/electrondipole.png', '/electrons/electrongaslaws.png',
        '/electrons/electronactivationenergy.png', '/electrons/electronboxandpointer.png', '/electrons/electrontrumpet.png', '/electrons/electronbst.png',
        '/electrons/electronblochsphere.png', '/electrons/electroncell.png', '/electrons/electronhybridization.png', '/electrons/electronpedigree.png',
        '/electrons/electronviolin.png', '/electrons/electrondrawingsheet.png', '/electrons/electronlimacon.png'
    ];
    const seed = mulberry32(millis);

    // UGWA technique of splitting options in two and pulling from a different pool every other day
    // to ensure no duplicate pictures
    const index = millis % (2 * 86400000) < 86400000
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
    const userData = useContext(UserDataContext);
    const [image, setImage] = useState<string | undefined>(undefined);

    useEffect(() => {
        const img = randomImage(viewDate.valueOf());
        setImage(img);
    }, [viewDate])

    return (
        <img
            src={image}
            alt="Electron doodle"
            style={{
                maxHeight: "min(350px, 35vh)", maxWidth: "min(600px, 100%)",
                filter: userData?.options.theme === 'dark' ? 'invert(1) hue-rotate(180deg)' : ''
            }}
        />
    )
}
