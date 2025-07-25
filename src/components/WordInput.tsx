import { ComponentProps } from "preact";
import { useEffect } from "preact/hooks";

import "./WordInput.css";

export const WordInput = (
    props: { isGood: boolean; isBad: boolean } & ComponentProps<"input">,
) => {
    const { isGood, isBad, ...rest } = props;
    useEffect(() => {
        const f = () => {
            const ip = document.getElementById("ip");
            if (ip) ip.focus();
        };
        document.addEventListener("focus", f);
        return () => {
            document.removeEventListener("focus", f);
        };
    }, []);

    return (
        <input
            {...rest}
            id="ip"
            onBlur={(e) => {
                setTimeout(() => {
                    if (
                        "focus" in e.target &&
                        typeof e.target.focus === "function"
                    )
                        e.target.focus();
                });
            }}
            ref={(el) => {
                if (el) el.focus();
            }}
            class={`${isGood ? "Good" : ""}${isGood && isBad ? " " : ""}${isBad ? "Bad" : ""}`}
            autoFocus
        />
    );
};
