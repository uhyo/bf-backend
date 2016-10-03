//asm validation.
import {
    Op,
    Block,
    Program,
} from './asm';

export function isValidOp(op: Op): boolean{
    const valids = [
        'nop',
        'push',
        'discard',
        'dup',
        'add', 'sub',
        'in', 'out',
        'jump', 'jumpifz', 'end',
    ];
    if (valids.indexOf(op.type) < 0){
        return false;
    }
    if (op.type === 'dup'){
        // CharValueであることを保証しないとだめ
        if (op.times.type !== 'char'){
            return false;
        }
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
