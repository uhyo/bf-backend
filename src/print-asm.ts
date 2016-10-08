// Asm printer.
import {
    Value,
    Op,
    Block,
    Program,
} from './asm';

export function printProgram({blocks, start}: Program): string{
    let result = '';
    for (let b of blocks){
        result += printBlock(b);
    }
    return result;
}
function printBlock({addr, code}: Block): string{
    let result = '';
    result += `*${addr}:\n`;
    for (let op of code){
        const opstr = printOp(op);
        result += `\t${opstr};\n`;
    }
    return result;
}
function printOp(op: Op): string{
    const delim = '\t\t';
    switch (op.type){
        case 'mov': case 'sub': {
            const f = String(op.from);
            const ts = op.to.map(String).join(', ');
            return `${op.type}${delim}${f}, ${ts}`;
        }
        case 'clr':
        case 'movp':
        case 'in':
        case 'out': {
            const at = String(op.at);
            return `${op.type}${delim}${at}`;
        }
        case 'addi': {
            const at = String(op.at);
            const v = printValue(op.value);
            return `${op.type}${delim}${at}, ${v}`;
        }
        default:
            return op.type;
    }
}
function printValue(v: Value): string{
    switch (v.type){
        case 'char':
            return String(v.value);
        case 'addr':
            return v.value;
        case 'unit':
            return '()';
    }
}
