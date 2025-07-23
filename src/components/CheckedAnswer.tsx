import { useMemo } from "preact/hooks";
import { Letter } from "./Letter";
import { wordsDiff } from "../lib/wordsDiff";

export const CheckedAnswer = (props: { current: string; target: string }) => {
    const { current, target } = props;
    const diff = useMemo(() => wordsDiff(current, target), [current, target]);
    return (
        <>
            <div style={{ whiteSpace: "preserve" }}>
                {diff.map((l) => (
                    <Letter {...l} />
                ))}
            </div>
        </>
    );
};
