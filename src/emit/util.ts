import {
    Value,
} from '../asm';


export interface AddrMap {
    [addr: string]: number;
}
export interface EmitEnvironment {
    // program end address. (larger than any block address)
    endAddr: number;
    addrmap: AddrMap;
}



/**
 * interpret value to number.
 * @param {Value} value
 * @param {AddrMap} map
 */
export function interpretValue(value: Value, map: AddrMap): number{
    switch (value.type){
        case 'char':
            return value.value;
        case 'addr':
            return map[value.value];
        case 'unit':
            return 0;
    }
}
