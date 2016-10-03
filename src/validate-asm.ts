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
    if (!code.every(isValidOp)){
        // 未定義命令があったらだめ
        return false;
    }
    const lastop = code[code.length-1];
    if (lastop == null){
        return false;
    }
    // 最後のopはcontrol flow命令でないとだめ
    return isFlowOp(lastop);
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
