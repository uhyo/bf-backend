// Op emitter.
import {
    Op,
} from '../asm';
import {
    EmitEnvironment,
    interpretValue,
} from './util';
import * as stack from './stack';
import * as flow from './flow';
import * as io from './io';

/**
 * Emit individual ops.
 * @param {Op} op
 */
export function emitOp(op: Op, env: EmitEnvironment): string{
    const {
        addrmap,
    } = env;
    switch (op.type){
        case 'nop':
            return '';
        case 'mov': {
            return stack.destructiveDup(op.from, op.to, true);
        }
        case 'clr': {
            return stack.clearValue(op.at);
        }
        case 'addi': {
            const val = interpretValue(op.value, addrmap);
            return stack.moveStackPointer(op.at) + stack.addValue(val) + stack.moveStackPointer(-op.at);
        }
        case 'sub': {
            return stack.destructiveSub(op.from, op.to);
        }
        case 'movp': {
            return stack.moveStackPointer(op.at);
        }
        case 'in': {
            let result = stack.moveStackPointer(op.at);
            result += io.charIn();
            result += stack.moveStackPointer(-op.at);
            return result;
        }
        case 'out': {
            let result = stack.moveStackPointer(op.at);
            result += io.charOut();
            result += stack.moveStackPointer(-op.at);
            return result;
        }
        case 'jump': {
            // jump target address is on top of the stack
            return '';
        }
        case 'jumpifz': {
            // stack: (value) (zero-addr) (nonzero-addr) [?]
            // It consumes 3 values.
            let result = '';
            result += stack.moveStackPointer(-3);
            result += flow.whileBlock(()=>{
                let result = '';
                // stack: [value] (zero-addr) (nonzero-addr)

                // valueが0でないならnonzero-addrを採用
                result += stack.moveValue(2, 1);
                result += stack.clearValue();
                // stack: [0] (nonzero-addr) 0
                return result;
            });
            // stack: [0] (zero-addr/nonzero-addr)
            result += stack.moveValue(1, 0);
            result += stack.moveStackPointer(1);
            // stack: target-addr [?]
            return result;
        }
        case 'end': {
            // endAddrをスタックに積む
            let result = stack.clearValue();
            result += stack.addValue(env.endAddr);
            result += stack.moveStackPointer(1);
            return result;
        }
        case 'debug': {
            // Debug 命令を出力
            return '$';
        }
    }
}
