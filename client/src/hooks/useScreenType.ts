// Paste from https://github.com/GunnWATT/watt/issues/6#issuecomment-817066179
import {useMediaQuery} from 'react-responsive';

export const useScreenType = () => {
    const desktop = useMediaQuery({ minWidth: 1440 });
    const tablet = useMediaQuery({ minWidth: 1265 });
    const smallScreen = useMediaQuery({ minWidth: 800 });

    if (desktop) return 'desktop';
    if (tablet) return 'tablet';
    if (smallScreen) return 'smallScreen';
    return 'phone';
}
