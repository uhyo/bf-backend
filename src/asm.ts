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
export interface Push{
    type: 'push';
    value: Value;
}
export interface Discard{
    type: 'discard';
}
export interface Add{
    type: 'add';
}
export interface In{
    type: 'in';
}
export interface Out{
    type: 'out';
}
export interface Goto{
    type: 'goto';
}

export type Op =
    // Stack Manipulation.
    Push |
    Discard |
    Add |
    // I/O.
    In | Out |
    // Jump.
    Goto;

// Def. of Program.
export interface Block{
    addr: string;
    code: Array<Op>;
}
export interface Program{
    blocks: Array<Block>;
    start: AddrValue;
}
