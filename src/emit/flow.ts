// flow control emitter.

/**
 * Make a WHILE block that executes if stack is non-zero.
 * @param {Function} callback - Function that emits the content of the block.
 */
export function whileBlock(callback: ()=>string): string{
    return whileStart() + callback() + whileEnd();
}

/**
 * Returns a WHILE block starter.
 */
export function whileStart(): string{
    return '[';
}

/**
 * Returns a WHILE block ender.
 */
export function whileEnd(): string{
    return ']';
}
