// Brainfuckソースに対するoptimization (簡単)

export function optimize(source: string): string{
    let result: Array<string> = [];
    // >と<とか+と-を打ち消すだけ
    let j = 0;
    const l = source.length;
    for (let i=0; i<l; i++){
        const c = source[i];
        // pendingの最後と打ち消すかもしれない
        const prev = result[j-1];
        if (prev==='<' && c==='>' || prev==='>' && c==='<' ||
            prev==='+' && c==='-' || prev==='-' && c==='+'){
            // 打ち消す
            j--;
        }else{
            result[j++] = c;
        }
    }
    return result.join('');
}
