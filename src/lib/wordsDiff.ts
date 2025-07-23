import { maxSubsequence } from "./maxSubsequence";

export function wordsDiff(from: string, to: string) {
    const current = [...from];
    const target = [...to];
    const subseq = [...maxSubsequence(from, to)];
    const buf = [];
    let hasExessCharsBefore = false;
    while (target.length > 0 || current.length > 0) {
        debugger;
        if (target[0] === current[0]) {
            buf.push({
                char: target[0],
                status: "correct",
                hasExessCharsBefore,
            });
            current.shift();
            target.shift();
            subseq.shift();
            hasExessCharsBefore = false;
            continue;
        }
        if (target[0] !== subseq[0] && current[0] === subseq[0]) {
            buf.push({
                char: target[0],
                status: "missing",
                hasExessCharsBefore,
            });
            hasExessCharsBefore = false;
            target.shift();
            continue;
        }
        if (current[0] !== subseq[0] && target[0] === subseq[0]) {
            hasExessCharsBefore = true;
            current.shift();
            continue;
        }
        buf.push({
            char: target[0],
            status: "wrong",
            hasExessCharsBefore,
        });
        current.shift();
        target.shift();
        hasExessCharsBefore = false;
    }
    if (hasExessCharsBefore)
        buf.push({ char: " ", status: "wrong", hasExessCharsBefore });
    return buf;
}
