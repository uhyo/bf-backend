// Declaration of the Stack-Asm.

// Def. of values.
export interface CharValue{
    type: 'char';
    value: number;
}
export interface AddrValue{
    type: 'addr';
    value: string;
}
export interface UnitValue{
    type: 'unit';
}

export type Value = CharValue | AddrValue | UnitValue;

// Def. of Ops.
export interface Nop{
    type: 'nop';
}
export interface Push{
    type: 'push';
    value: Value;
}
export interface Dup{
    type: 'dup';
    times: CharValue;
}
export interface Discard{
    type: 'discard';
}
export interface Swap{
    type: 'swap';
}
export interface Add{
    type: 'add';
}
export interface Sub{
    type: 'sub';
}
export interface In{
    type: 'in';
}
export interface Out{
    type: 'out';
}
export interface Jump{
    type: 'jump';
}
export interface JumpIfZ{
    type: 'jumpifz';
}
export interface End{
    type: 'end';
}

export type Op =
    Nop |
    // Stack Manipulation.
    Push |
    Discard |
    Dup |
    Swap |
    Add | Sub |
    // I/O.
    In | Out |
    // Jump.
    Jump | JumpIfZ | End;

// Def. of Program.
export interface Block{
    addr: string;
    code: Array<Op>;
}
export interface Program{
    blocks: Array<Block>;
    start: AddrValue;
}
