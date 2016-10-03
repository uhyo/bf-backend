import {
    Program,
    Block,
    Op,
    AddrValue,
    CharValue,
    Value,
} from './asm';

// asmをmakeするfunctionだ
export namespace make{
    export function addrValue(value: string): AddrValue{
        return {
            type: 'addr',
            value,
        };
    }
    export function charValue(value: number | string): CharValue{
        if ('number' === typeof value){
            return {
                type: 'char',
                value,
            };
        }
        let r = value.match(/^([\+\-])?(?:0([xob]))?([0-9a-f]+)$/i);
        if (r != null){
            return {
                type: 'char',
                value: ch(r[1], r[2], r[3]),
            };
        }
        r = value.match(/^([\+\-])?([0-9a-d]+)([xob])?$/i);
        if (r == null){
            throw new Error('Cannot parse char value');
        }
        return {
            type: 'char',
            value: ch(r[1], r[3], r[2]),
        };
        function ch(sign: string, prefix: string, main: string): number{
            const s = sign === '-' ? -1 : 1;
            switch (prefix && prefix.toLowerCase()){
                case 'x':
                    return s * parseInt(main, 16);
                case 'o':
                    return s * parseInt(main, 8);
                case 'b':
                    return s * parseInt(main, 2);
                default:
                    return s * parseInt(main, 10);
            }
        }
    }
    export function Nop(): Op{
        return {
            type: 'nop',
        };
    }
    export function op(ty: string, args: Array<Value>): Op{
        const type = ty.toLowerCase();
        switch (type){
            case 'push': return {
                type: 'push',
                value: args[0],
            };
            case 'dup': return {
                type: 'dup',
                times: args[0] != null ? (args[0] as CharValue) : {
                    type: 'char',
                    value: 1,
                },
            } as Op;
            default: return {
                type,
            } as Op;
        }
    }
    export function block(addr: string, code: Array<Op>): Block{
        return {
            addr,
            code,
        };
    }
    export function program(blocks: Array<Block>): Program{
        return {
            blocks,
            start: {
                type: 'addr',
                value: blocks[0].addr,
            },
        };
    }
}
