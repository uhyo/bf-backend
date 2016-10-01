import * as cli from 'cli';
import * as fs from 'fs';
import {
    Program,
} from './asm';
import {
    printProgram,
} from './print-asm';

const {
    parser,
} = require('./parser') as any;

const options = cli.parse();

// input file
const file = cli.args[0];

const data = fs.readFileSync(file, 'utf8');

const program: Program = parser.parse(data);
console.log(printProgram(program));
