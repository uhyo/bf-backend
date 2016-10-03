import * as cli from 'cli';
import * as fs from 'fs';
import {
    Program,
} from './asm';
import {
    printProgram,
} from './print-asm';
import {
    isValidProgram,
} from './validate-asm';
import {
    emit,
} from './emit/index';

const {
    parser,
} = require('./parser') as any;

const options = cli.parse({
    debug: ['d', 'Debug output', 'boolean', false],
});

// input file
const file = cli.args[0];

const data = fs.readFileSync(file, 'utf8');

const program: Program = parser.parse(data);
if (!isValidProgram(program)){
    throw new Error('Invalid program');
}
if (options.debug){
    console.log(printProgram(program));
}

console.log(emit(program));
