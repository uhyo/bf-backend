//asm validation.
import {
    Op,
    Block,
    Program,
} from './asm';

export function isValidOp({type}: Op): boolean{
    const valids = [
        'nop',
        'push',
        'discard',
        'add',
        'in', 'out',
        'jump', 'jumpifz', 'end',
    ];
    return valids.indexOf(type) >= 0;
}

export function isValidBlock({addr, code}: Block): boolean{
    return code.every(isValidOp);
}

export function isValidProgram({start, blocks}: Program): boolean{
    return blocks.some(({addr})=> addr === start.value) && blocks.every(isValidBlock);
}
