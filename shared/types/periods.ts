// An object representing a period, with s and e being start and end times (in minutes after 12:00 AM PST)
// and n being the period's key. 0-8 represent periods 0 through 8, while B, L, S, and P represent Brunch, Lunch, SELF,
// and PRIME, respectively. G and O represent the now deprecated Gunn Together and Office Hours periods. All other period
// names, like "ELA CAT", remain unparsed.
export type PeriodObj = {n: string, s: number, e: number, note?: string};
