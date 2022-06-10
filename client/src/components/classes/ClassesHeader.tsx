import {useContext} from 'react';
import {Popover} from '@headlessui/react';

// Components
import {Header} from '../layout/HeaderPage';
import AnimatedPopover from '../layout/AnimatedPopover';
import Dot from '../layout/Dot';

// Contexts
import UserDataContext, {SgyPeriod} from '../../contexts/UserDataContext';
import SgyDataContext from '../../contexts/SgyDataContext';

// Utilities
import {findClassesList} from '../../pages/Classes';
import {bgColor} from '../../util/progressBarColor';


type ClassesHeaderProps = { selected: SgyPeriod | 'A', setSelected: (selected: SgyPeriod | 'A') => void };
export default function ClassesHeader(props: ClassesHeaderProps) {
    const {selected, setSelected} = props;

    const userData = useContext(UserDataContext);
    const {sgyData} = useContext(SgyDataContext);

    const classes = findClassesList(sgyData, userData, true);
    const {name: currName, color: currColor} = findClassesList(sgyData, userData).find(({period}) => period === selected)!;

    return (
        <Header>
            <Popover className="relative">
                <Popover.Button className="flex items-center gap-4">
                    <Dot
                        size={40}
                        color={currColor}
                        border={`2px solid ${bgColor(currColor)}`}
                    />
                    <h1 className="pb-1 mb-0">{currName}</h1>
                </Popover.Button>
                <AnimatedPopover className="absolute top-[calc(100%_+_10px)] flex flex-col py-4 text-primary dark:text-primary-dark bg-content dark:bg-content-dark rounded shadow-lg z-10">
                    {classes.map(({name, color, period}) => (
                        <div
                            className={'flex items-center gap-2.5 py-1 px-5 cursor-pointer transition duration-100 ' + (period === selected ? 'bg-content-secondary dark:bg-black/20' : 'hover:bg-content-secondary dark:hover:bg-black/20')}
                            onClick={() => setSelected(period)}
                            key={period}
                        >
                            <Dot
                                size={30}
                                color={color}
                                border={period === selected ? `3px solid ${bgColor(color)}` : undefined}
                            >
                                {period}
                            </Dot>
                            <p className="whitespace-nowrap">{name}</p>
                        </div>
                    ))}
                </AnimatedPopover>
            </Popover>
        </Header>
    )
}
