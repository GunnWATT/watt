// Paste from https://github.com/GunnWATT/watt/issues/6#issuecomment-817066179
import {useMediaQuery} from 'react-responsive';

export function useScreenType() {
    const desktop = useMediaQuery({ minWidth: 1536 });
    const tablet = useMediaQuery({ minWidth: 1280 });
    const smallScreen = useMediaQuery({ minWidth: 768 });

    if (desktop) return 'desktop';
    if (tablet) return 'tablet';
    if (smallScreen) return 'smallScreen';
    return 'phone';
}
