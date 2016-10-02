// stack maniplation emitter.
import {
    Value,
} from '../asm';

/**
 * Push a value onto the stack.
 * @param {number} value - value to push.
 * @param {boolean} initial - assume that the top of the stack is zero-cleared.
 */
export function pushCharValue(value: number, initial:boolean = false): string{
    let result = '';
    if (!initial){
        // zero-clear
        result += '[-]';
    }
    // push value
    result += '+'.repeat(value);
    // move stack pointer
    result += '>';
    return result;
}

/**
 * Add to the current value.
 * @param {number} value
 */
export function addValue(value: number): string{
    if (value >= 0){
        return '+'.repeat(value);
    }else{
        return '-'.repeat(-value);
    }
}

/**
 * Move a stack pointer.
 * @param {number} d - move steps;
 */
export function moveStackPointer(d: number): string{
    if (d >= 0){
        return '>'.repeat(d);
    }else{
        return '<'.repeat(-d);
    }
}

/**
 * Perform a destructive duplication.
 * @param {number} from - Relative address of the copied data.
 * @param {Array<number>} tos - Relative addresses of copied target.
 * @param {boolean} nocleanup - Don't zero-clear before duplication.
 */
export function destructiveDup(from: number, tos: Array<number>, nocleanup: boolean = false): string{
    let result = '';
    if (!nocleanup){
        // コピー先を掃除する
        let prev = 0;
        for (let to of tos){
            result += moveStackPointer(to - prev);
            result += '[-]';
            prev = to;
        }
        result += moveStackPointer(-prev);
    }
    result += moveStackPointer(from);
    let prev = from;
    // destructive duplication
    result += '[-';
    for (let to of tos){
        result += moveStackPointer(to - prev);
        result += '+';
        prev = to;
    }
    result += moveStackPointer(from - prev);
    result += ']';
    // 元の位置に戻す
    result += moveStackPointer(-from);
    return result;
}

/**
 * Zero-clear a memory.
 * @param {number} target - Relative address to clear.
 */
export function clearValue(target: number = 0): string{
    return destructiveDup(target, []);
}

/**
 * Move a value.
 * @param {number} from - origin relative to current position.
 * @param {number} dest - destination relative to current position.
 * @param {boolean} nocleanup - Don't zero-clear before move.
 */
export function moveValue(from: number, dest: number, nocleanup: boolean = false): string{
    return destructiveDup(from, [dest], nocleanup);
}

