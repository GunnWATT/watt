export function similarity(a: string, b: string) {
    const lcs = (a, b) => { // longest common substring
        let maxsubstr = "";
        let starta = 0;
        let enda = 0;
        let startb = 0;
        let endb = 0;

        for (let i = 0; i < a.length; i++) {
            for (let j = i + 1; j <= a.length; j++) {
                let substr = a.slice(i, j);

                let ind = b.indexOf(substr);
                if (substr.length > maxsubstr.length && ind >= 0) {
                    maxsubstr = substr;

                    [starta, enda, startb, endb] = [i, j, ind, ind + substr.length];
                }
            }
        }

        // returns longest substring, its length, the start/end of it in a and b.
        return [maxsubstr, maxsubstr.length, starta, enda, startb, endb];
    }

    // returns numerator of the R-O formula thing
    const raw = (a, b) => {
        let longest = lcs(a, b);
        if (longest[1] === 0)
            return 0;

        return longest[1]
            + raw(a.slice(0, longest[2]), b.slice(0, longest[4]))
            + raw(a.slice(longest[3]), b.slice(longest[5]));
    }

    return raw(a.toLowerCase(), b.toLowerCase()) * 2 / (a.length + b.length);
}