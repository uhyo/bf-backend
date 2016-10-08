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
export interface Mov{
    type: 'mov';
    from: number;
    to: Array<number>;
}
export interface Clr{
    type: 'clr';
    at: number;
}
export interface Addi{
    type: 'addi';
    at: number;
    value: Value;
}
export interface Sub{
    type: 'sub';
    from: number;
    to: Array<number>;
}
export interface Movp{
    type: 'movp';
    at: number;
}
export interface In{
    type: 'in';
    at: number;
}
export interface Out{
    type: 'out';
    at: number;
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
export interface Debug{
    type: 'debug';
}

export type Op =
    Nop |
    // Memory Manipulation.
    Mov |
    Clr |
    Addi |
    Sub |
    // Data Pointer.
    Movp |
    // I/O.
    In | Out |
    // Flow control.
    Jump | JumpIfZ | End |
    // Debug instruction.
    Debug;

// Def. of Program.
export interface Block{
    addr: string;
    code: Array<Op>;
}
export interface Program{
    blocks: Array<Block>;
    start: AddrValue;
}
