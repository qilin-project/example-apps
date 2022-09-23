import * as chalk from 'chalk';
import config from './Config';

export class Logger {
    public name: string;
    public color: chalk.Chalk

    public constructor(name: string, color: string) {
        this.color = chalk.hex(color);
        this.name = `${this.color}${name}${chalk.reset()}`;
    };

    public start(msg: string) {
        console.log(
            chalk.hex(`${config.color.starting}`),`[ 🟢 ] `, this.name,
            `: `, chalk.hex(`${config.color.data.default}`), msg
        )
    };

    public stop(msg: string) {
        console.log(
            chalk.hex(`${config.color.stopping}`),`[ 🔴 ] `, this.name,
            `: `, chalk.hex(`${config.color.data.default}`), msg
        )
    };

    public debug(data: any) {
        console.log(
            chalk.hex(`${config.color.debug}`),`[   ] `, this.name,
            `: `, chalk.hex(`${config.color.data.debug}`), data
        )
    };

    public log(data: any) {
        console.log(
            chalk.hex(`${this.color}`),`[ 🔔 ] `, this.name,
            `: `, chalk.hex(`${config.color.data.default}`), data
        )
    };

    public warn(data: any) {
        console.log(
            chalk.hex(`${config.color.warn}`),`[ ⚠️ ] `, this.name,
            `: `, chalk.hex(`${config.color.data.warn}`), data
        )
    };

    public error(data: any) {
        console.log(
            chalk.hex(`${config.color.error}`),`[ ❗ ] `, this.name,
            `: `, chalk.hex(`${config.color.data.error}`), data
        )
    };

}