// Brainfuck emitter.
import {
    Program,
    Value,
    CharValue,
    AddrValue,
    Block,
    Op,
} from '../asm';
import * as stack from './stack';
import * as flow from './flow';
import {
    AddrMap,
    interpretValue,
} from './util';

export function emit({blocks, start}: Program): string{
    // Blockをreorderする
    const bs = reorderBlocks(blocks, start);
    const map = makeAddrMap(bs);

    return emitBlocks(bs, map);
}

// valueになっている奴を最初にしてあとは流れで
function reorderBlocks(blocks: Array<Block>, {value}: AddrValue): Array<Block>{
    const result: Array<Block> = [];
    for (let b of blocks){
        if (b.addr === value){
            result.unshift(b);
        }else{
            result.push(b);
        }
    }
    return result;
}
// ブロックのラベル名を整数アドレスと対応付ける
function makeAddrMap(blocks: Array<Block>): AddrMap{
    const result: AddrMap = {};
    const l = blocks.length;
    for (let i=0; i<l; i++){
        const {
           addr,
        } = blocks[i];
        result[addr] = i;
    }
    return result;
}

// プログラム全体: inter-Blockの制御
function emitBlocks(blocks: Array<Block>, map: AddrMap): string{
    let result = '';
    // 最初は0番ブロックから開始
    // 3番にプログラム実行中フラグを立てる
    result += stack.moveStackPointer(3);
    result += stack.addValue(1);
    // stack: 0 0 0 [1]

    // 最外ループの開始
    result += flow.whileBlock(()=>{
        let result = '';
        let loopsuffix = '';

        // stack: addr ? ? [1]
        result += stack.moveStackPointer(-3);

        // 各ブロック処理
        for (let b of blocks){
            // スタックの一番上は実行addrになっている （減っていって0なら実行）

            // addrをコピー
            result += stack.destructiveDup(-1, [0, 1]);

            // このブロックを実行するフラグを作る
            result += stack.moveStackPointer(2);
            result += stack.pushCharValue(1);
            // addrが0かそれ以外かで分岐
            result += stack.moveStackPointer(-2);
            // stack: 0 addr [addr] 1
            result += flow.whileBlock(()=>{
                let result = '';
                // addrが0ではないのでこのブロックを実行しない

                // フラグを折る
                result += stack.moveStackPointer(1);
                result += stack.addValue(-1);
                // addrを1減らす
                result += stack.moveStackPointer(-2);
                result += stack.addValue(-1);

                // コピーしたaddrは用済みなので0にする
                result += stack.moveStackPointer(1);
                result += stack.clearValue();
                // stack: 0 (addr-1) [0] 0
                return result;
            });
            // addrが0だった場合 →  0 0 [0] 1
            // 0ではなかった場合 → 0 (addr-1) [0] 0
            // 余計なスタックをアレする
            result += stack.destructiveDup(1, [0, -2], true);
            result += stack.moveStackPointer(-2);
            // stack: [0/1] (addr-1) (0/1)
            result += flow.whileBlock(()=>{
                // 1なら該当ブロックなので処理を実行
                let result = emitBlock(b);
                // stack: (next-addr) [?]
                // フラグを再セット
                result += stack.moveStackPointer(2);
                result += stack.clearValue();
                result += stack.addValue(1);
                // ここを0にしてループを抜ける
                result += stack.moveStackPointer(-2);
                result += stack.clearValue();
                // stack: (next-addr) [0] ? 1
                return result;
            });
            // ここから後処理と次のブロックへの移行処理
            // stack: [0] (addr-1?) (0/1)
            // {+2}が1だった場合実行終了
            result += stack.addValue(1);
            result += stack.moveStackPointer(3);
            result += stack.clearValue();
            result += stack.moveStackPointer(-1);
            // stack: 1 (addr-1?) [0/1] 0
            // まず0/1反転
            result += flow.whileBlock(()=>{
                let result = '';
                result += stack.moveStackPointer(-2);
                result += stack.addValue(-1);
                result += stack.moveStackPointer(3);
                result += stack.addValue(1);
                result += stack.moveStackPointer(-1);
                result += stack.clearValue();
                return result;
            });
            result += stack.moveStackPointer(-2);
            // stack: [1/0] (addr-1?) 0 [0/1]
            // {0}1なら実行継続 {+3}は{0}と逆(0なら実行継続)
            result += flow.whileStart();
            result += stack.moveValue(1, 0);
            // stack: [addr-1]
            // これで次のブロックに実行移譲

            // ループ終了処理
            // stack: (next-addr) [0] ? 0 (1/0) なのでそのまま終わればOK ({+3}が0ならプログラム死亡フラグ)
            loopsuffix += flow.whileEnd();

        }
        // ここはどのブロックにも入らずに最後まできた場合の処理（プログラム終了）
        // {+3}を0にすることでプログラム終了フラグ
        result += stack.moveStackPointer(3);
        result += stack.clearValue();
        result += stack.moveStackPointer(-3);
        result += stack.clearValue();
        // stack: [0] ? ? 0
        
        // ループの終焉
        result += loopsuffix;
        // {+3}にプログラム生存フラグが入っている(0なら終了)
        result += stack.moveStackPointer(3);
        return result;
    });

    console.log(blocks, map);
    return result;
}

function emitBlock(_b: Block): string{
    return '^o^';
}
