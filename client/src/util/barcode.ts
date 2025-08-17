// Draws the barcode on a canvas element.
// Call this using a ref callback to initialize `<canvas>` elements with the barcode.
export function drawCodeOnCanvas(canvas: HTMLCanvasElement | null, code: string) {
    if (!canvas) return;
    const c = canvas.getContext('2d')!;

    const chars = ['*', ...code.toUpperCase().split('').filter(char => code39Values.hasOwnProperty(char)), '*'];

    canvas.height = 100
    canvas.width = chars.length * 16 - 1
    c.clearRect(0, 0, canvas.width, canvas.height)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)
    c.fillStyle = 'black'
    for (let i = 0, x = 0; i < chars.length; i++) {
        const pattern = code39Values[chars[i]].toString(3);
        for (let j = 0; j < pattern.length; j++)
            switch (pattern[j]) {
                case '2':
                    c.fillRect(x, 0, 3, canvas.height)
                    x += 4
                    break
                case '1':
                    c.fillRect(x, 0, 1, canvas.height)
                    x += 2
                    break
                case '0':
                    x += 2
                    break
            }
    }
}

// Ported from UGWA
// https://github.com/Orbiit/gunn-web-app/blob/master/js/code39.js
export const code39Values: { [key: string]: number } = {
    '0': 349, '1': 581, '2': 419, '3': 661, '4': 347, '5': 589, '6': 427, '7': 341, '8': 583, '9': 421,
    A: 599, K: 605, U: 527, B: 437, L: 443, V: 311, C: 679, M: 685, W: 553, D: 383, N: 389, X: 293,
    E: 625, O: 631, Y: 535, F: 463, P: 469, Z: 319, G: 359, Q: 371, '-': 287, H: 601, R: 613, '.': 529,
    I: 439, S: 451, ' ': 313, J: 385, T: 397, '*': 295, '+': 2521, '/': 2467, $: 2461, '%': 3007
}