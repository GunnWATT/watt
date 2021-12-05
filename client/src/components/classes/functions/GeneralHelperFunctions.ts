// Some useful functions here

// Classifying a grade
export const classifyGrade = (grade: number) => {
    if (grade >= 93) return 'A';
    if (grade >= 90) return 'A-';
    if (grade >= 87) return 'B+';
    if (grade >= 83) return 'B';
    if (grade >= 80) return 'B-';
    if (grade >= 77) return 'C+';
    if (grade >= 73) return 'C';
    if (grade >= 70) return 'C-';
    if (grade >= 67) return 'D+';
    if (grade >= 63) return 'D';
    return 'D-';
}

// 1 -> 1st, 2 -> 2nd, 3 -> 3rd, 4 -> 4th english why
export const cardinalize = (num: number) => {
    if(num%100 === 11) return num + 'th';
    if(num%100 === 12) return num + 'th';
    if(num%100 === 13) return num + 'th';
    switch (num % 10) {
        case 1:
            return num + 'st';
        case 2:
            return num + 'nd';
        case 3:
            return num + 'rd';
        default:
            return num + 'th';
    }
}

// Function to calculate Ratcliff-Obershelp string similarity
// https://en.wikipedia.org/wiki/Gestalt_Pattern_Matching

const p = 1.3;

// It's actually a modified version that prioritizes substrings being together
export function similarity(a: string, b: string) {
    // i modify it to use 2min(|A|, |B|) instead of |A| + |B|
    return rawOverlap(a.toLowerCase(), b.toLowerCase()) / Math.min(a.length, b.length)**p;
}

// returns numerator of the R-O formula thing
export const rawOverlap = (a: string, b: string): number => {
    const longest = lcs(a, b);
    if (longest[1] === 0)
        return 0;

    return longest[1]**p
        + rawOverlap(a.slice(0, longest[2]), b.slice(0, longest[4]))
        + rawOverlap(a.slice(longest[3]), b.slice(longest[5]));
}

// Function to find longest common substring between two strings
// Returns the longest substring, its length, and the start/end indices of it in a and b
function lcs(a: string, b: string): [string, number, number, number, number, number] {
    let maxSubstr = "";
    let starta = 0, enda = 0, startb = 0, endb = 0;

    for (let i = 0; i < a.length; i++) {
        for (let j = i + 1; j <= a.length; j++) {
            let substr = a.slice(i, j);

            let ind = b.indexOf(substr);
            if (substr.length > maxSubstr.length && ind >= 0) {
                maxSubstr = substr;

                [starta, enda, startb, endb] = [i, j, ind, ind + substr.length];
            }
        }
    }

    return [maxSubstr, maxSubstr.length, starta, enda, startb, endb];
}
