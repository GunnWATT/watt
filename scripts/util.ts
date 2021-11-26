// Function to calculate Ratcliff-Obershelp string similarity
// https://en.wikipedia.org/wiki/Gestalt_Pattern_Matching
export function similarity(a: string, b: string) {
    // returns numerator of the R-O formula thing
    const raw = (a: string, b: string): number => {
        const longest = lcs(a, b);
        if (longest[1] === 0)
            return 0;

        return longest[1]
            + raw(a.slice(0, longest[2]), b.slice(0, longest[4]))
            + raw(a.slice(longest[3]), b.slice(longest[5]));
    }

    return raw(a.toLowerCase(), b.toLowerCase()) * 2 / (a.length + b.length);
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
