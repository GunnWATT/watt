/**
 * Utility file to wrap `chalk` console log coloring and standardize warnings and errors produced by scripts.
 * TODO: figure out a better way to not hang without forcing every script to call `closeStream()`
 */

import chalk from 'chalk';
import readline from 'readline/promises';


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

export function info(message: string) {
    console.log(`${chalk.green('[INFO]')}: ${message}`)
}

export function warn(message: string) {
    console.warn(`${chalk.yellow('[WARNING]')}: ${message}`);
}

export function error(message: string) {
    console.error(`${chalk.red('[ERROR]')}: ${message}`);
}

export async function prompt(message: string) {
    return rl.question(`↳ ${message} `);
}

export function closeStream() {
    rl.close();
}
