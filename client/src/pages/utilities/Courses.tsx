import {useState} from 'react';
import {DateTime} from 'luxon';

// Components
import Search from '../../components/layout/Search';
import CourseComponent from '../../components/lists/CourseComponent';

// Data
import courses from '@watt/shared/data/courses';


export default function Courses() {
    const {timestamp, data} = courses;
    const [query, setQuery] = useState('');

    return (
        <>
            <span className="flex gap-4 items-center">
                <h1>Courses</h1>
                <Search
                    placeholder="Search Courses"
                    onChange={e => setQuery(e.target.value)}
                />
            </span>
            <p className="mb-4 text-secondary">
                Please note that course information was taken from the{' '}
                <a href="https://resources.finalsite.net/images/v1644602080/pausdorg/ezni0vcdqg5i3hxnfe5c/GunnCourseCatalog22-23_2-11-22Rev.pdf" target="_blank" rel="noopener noreferrer">2022-2023 Gunn Course Catalog PDF</a>{' '}
                as of {DateTime.fromISO(timestamp).toLocaleString(DateTime.DATE_FULL)}. Attribute inaccuracies to them.
            </p>

            {/* TODO: better filtering? */}
            {/* TODO: this `grid-cols` breakpoint is a little hacky */}
            <ul className="md:grid md:grid-cols-[repeat(auto-fill,_minmax(450px,_1fr))] list-none">
                {data.filter((course) => course.names.some(({title}) => title.toLowerCase().includes(query.toLowerCase()))).map(course => (
                    <CourseComponent key={course.names[0].cid} {...course} />
                ))}
            </ul>
        </>
    );
}
