//asm validation.
import {
    Op,
    Block,
    Program,
} from './asm';

export function isValidOp(op: Op): boolean{
    const valids = [
        'nop',
        'mov',
        'clr',
        'addi',
        'sub',
        'movp',
        'in', 'out',
        'jump', 'jumpifz', 'end',
        'debug',
    ];
    if (valids.indexOf(op.type) < 0){
        return false;
    }
    return true;
}

export function isValidBlock({addr, code}: Block): boolean{
    let lastflg = false;
    for (let op of code){
        if (!isValidOp(op)){
            // 未定義命令はだめ
            return false;
        }
        if (lastflg === true){
            return false;
        }
        if (isFlowOp(op)){
            lastflg = true;
        }
    }
    return lastflg;
}

export function isValidProgram({start, blocks}: Program): boolean{
    return blocks.some(({addr})=> addr === start.value) && blocks.every(isValidBlock);
}

function isFlowOp({type}: Op): boolean{
    const ts = [
        'jump',
        'jumpifz',
        'end',
    ];
    return ts.indexOf(type) >= 0;
}
