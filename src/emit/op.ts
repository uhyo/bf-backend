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
        case 'push': {
            const ch = interpretValue(op.value, addrmap);
            return stack.pushCharValue(ch);
        }
        case 'discard': 
            return stack.moveStackPointer(-1);
        case 'dup': {
            const {
                times: {
                    value: times,
                },
            } = op;
            let result = '';
            // stack: | x [?]
            // xをtimes回複製する
            const ts: Array<number> = [];
            for (let i=0; i<=times; i++){
                ts.push(i);
            }
            // XXX もっと効率のよい処理があるのでは？
            result += stack.destructiveDup(-1, ts);
            // そして戻す
            result += stack.moveValue(times, -1);
            result += stack.moveStackPointer(times);
            return result;
        }
        case 'add': {
            // stack: x y [?] => (x+y) [0]
            const add = stack.destructiveDup(-1, [-2], true);
            const mv = stack.moveStackPointer(-1);
            return add + mv;
        }
        case 'sub': {
            // stack: x y [?] => (x-y) [0]
            const sub = stack.destructiveSub(-1, [-2]);
            const mv = stack.moveStackPointer(-1);
            return sub + mv;
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
            // TODO
            let result = stack.pushCharValue(env.endAddr);
            return result;
        }
    }
}
