/**
 * Utility file to wrap `chalk` console log coloring and standardize warnings and errors produced by scripts.
 * TODO: standardize the use of this across scripts
 */

import chalk from 'chalk';

export function info(message: string) {
    console.log(`${chalk.green('[INFO]')}: ${message}`)
}

export function warn(message: string) {
    console.warn(`${chalk.yellow('[WARNING]')}: ${message}`);
}

export function error(message: string) {
    console.error(`${chalk.red('[ERROR]')}: ${message}`);
}
