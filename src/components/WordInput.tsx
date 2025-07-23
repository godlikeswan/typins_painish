import { ComponentProps } from "preact";
import { useEffect } from "preact/hooks";

export const WordInput = (props: ComponentProps<"input">) => {
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
            {...props}
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
            autoFocus
        />
    );
};
