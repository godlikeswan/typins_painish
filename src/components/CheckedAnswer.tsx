import { useMemo } from "preact/hooks";
import { Letter } from "./Letter";
import { wordsDiff } from "../lib/wordsDiff";

import "./CheckedAnswer.css";

export const CheckedAnswer = (props: {
    current: string;
    target: string;
    hidden: boolean;
}) => {
    const { current, target, hidden } = props;
    const diff = useMemo(
        () => (target && wordsDiff(current, target)) || [],
        [current, target],
    );
    return (
        <div class={`CheckedAnswer${hidden ? " hidden" : ""}`}>
            {diff.length === 0 ? (
                "..."
            ) : (
                <a
                    href={`https://en.wiktionary.org/wiki/${target}#Spanish`}
                    target="_blank"
                >
                    {diff.map((l) => (
                        <Letter {...l} />
                    ))}
                </a>
            )}
        </div>
    );
};
