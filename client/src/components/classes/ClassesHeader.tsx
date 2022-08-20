import {useContext} from 'react';
import {Listbox} from '@headlessui/react';

// Components
import {Header} from '../layout/HeaderPage';
import AnimatedListbox from '../layout/AnimatedListbox';
import Dot from '../layout/Dot';

// Contexts
import UserDataContext, {SgyPeriod} from '../../contexts/UserDataContext';
import SgyDataContext from '../../contexts/SgyDataContext';

// Utilities
import {findClassesList} from './ClassesLayout';
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
            <Listbox value={selected} onChange={setSelected}>
                <div className="relative max-w-full">
                    <Listbox.Button className="flex items-center gap-4 w-full focus:outline-none">
                        <Dot
                            size={40}
                            color={currColor}
                            border={`3px solid ${bgColor(currColor)}`}
                        />
                        <h1 className="pb-1 mb-0 overflow-ellipsis overflow-hidden whitespace-nowrap">
                            {currName}
                        </h1>
                    </Listbox.Button>
                    <AnimatedListbox className="absolute top-[calc(100%_+_10px)] max-w-xs md:max-w-sm flex flex-col py-4 text-primary bg-content rounded shadow-2xl z-10 focus:outline-none focus-visible:ring-1 focus-visible:ring-secondary/10 dark:focus-visible:ring-secondary/25">
                        {classes.map(({name, color, period}) => (
                            <Listbox.Option
                                className={({active}) => 'flex items-center gap-2.5 py-1 px-5 cursor-pointer transition duration-100' + (active ? ' bg-content-secondary dark:bg-black/20' : '')}
                                value={period}
                                key={period}
                            >
                                {({selected}) => (<>
                                    <Dot
                                        size={30}
                                        color={color}
                                        border={selected ? `3px solid ${bgColor(color)}` : undefined}
                                    >
                                        {period}
                                    </Dot>
                                    <p className="overflow-ellipsis overflow-hidden whitespace-nowrap">{name}</p>
                                </>)}
                            </Listbox.Option>
                        ))}
                    </AnimatedListbox>
                </div>
            </Listbox>
        </Header>
    )
}
