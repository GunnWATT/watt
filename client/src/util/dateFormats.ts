import {DateTime} from 'luxon';


// `10/14`
export const DATE_SHORT_NO_YEAR: Intl.DateTimeFormatOptions = {
    ...DateTime.DATE_SHORT,
    year: undefined
}

// `10/14/83`
export const DATE_SHORT_YEAR_SHORTENED: Intl.DateTimeFormatOptions = {
    ...DateTime.DATE_SHORT,
    year: '2-digit'
}

// `Friday, Oct 14`
export const DATE_MED_NO_YEAR: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
}

// `Friday, October 14`
export const DATE_FULL_NO_YEAR: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
}
