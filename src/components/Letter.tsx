import "./Letter.css";

export const Letter = (props: {
    char: string;
    status: string;
    hasExessCharsBefore: boolean;
}) => {
    const { char, status, hasExessCharsBefore } = props;
    return (
        <span
            class={`${status}${hasExessCharsBefore ? " hasExessCharsBefore" : ""}`}
        >
            {char}
        </span>
    );
};
