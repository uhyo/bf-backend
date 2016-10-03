// Op emitter.
import {
    Op,
} from '../asm';
import {
    EmitEnvironment,
    interpretValue,
} from './util';
import * as stack from './stack';
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
        case 'push': {
            const ch = interpretValue(op.value, addrmap);
            return stack.pushCharValue(ch);
        }
        case 'discard': 
            return stack.moveStackPointer(-1);
        case 'add': {
            // stack: x y [?] => (x+y) [0]
            const add = stack.destructiveDup(-1, [-2], true);
            const mv = stack.moveStackPointer(-1);
            return add + mv;
        }
        case 'in': {
            let result = io.charIn();
            result += stack.moveStackPointer(1);
            return result;
        }
        case 'out': {
            let result = stack.moveStackPointer(-1);
            result += io.charOut();
            result += stack.moveStackPointer(1);
            return result;
        }
        case 'jump': {
            // jump target address is on top of the stack
            return '';
        }
        case 'jumpifz': {
            throw new Error('Not Implemented yet');
        }
        case 'end': {
            // TODO
            let result = stack.pushCharValue(env.endAddr);
            return result;
        }
    }
}
