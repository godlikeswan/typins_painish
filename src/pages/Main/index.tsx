import { Page } from "../../components/Page";
import "./style.css";
import { useCallback, useEffect, useState } from "preact/hooks";
import { WordInput } from "../../components/WordInput";
import { CheckedAnswer } from "../../components/CheckedAnswer";
import { KeyboardEventHandler } from "preact/compat";
import { Defs } from "../../components/Def";
import { useCards } from "../../lib/cards/useCards";
import { useGoogle } from "../../lib/saveProgress/google/context";
import { useNavigate } from "react-router";

export const Main = () => {
    const { currentWord, processAnswer, cardsState, chooseNextWord } =
        useCards();
    const [showingAnswer, setShowingAnswer] = useState(false);
    const [input, setInput] = useState("");
    const { googleState } = useGoogle();
    const navigate = useNavigate();
    const [pendingEnter, setPendingEnter] = useState(false);

    useEffect(() => {
        if (googleState !== "ready") navigate("/");
    }, [googleState, navigate]);

    useEffect(() => {
        if (!pendingEnter || cardsState !== "idle" || showingAnswer) return;
        setShowingAnswer(true);
        processAnswer(input === currentWord);
        setPendingEnter(false);
    }, [pendingEnter, cardsState, showingAnswer]);

    useEffect(() => {
        const l: KeyboardEventHandler<HTMLElement> = (e) => {
            if (e.code === "Enter") {
                if (showingAnswer) {
                    setInput("");
                    setShowingAnswer(false);
                    chooseNextWord();
                } else {
                    if (cardsState !== "idle") {
                        setPendingEnter(true);
                        return;
                    }
                    setShowingAnswer(true);
                    processAnswer(input === currentWord);
                }
            }
        };
        document.addEventListener("keydown", l);
        return () => {
            document.removeEventListener("keydown", l);
        };
    }, [showingAnswer, currentWord, cardsState, chooseNextWord, input]);

    const onEnterButtonClick = useCallback(() => {
        if (showingAnswer) {
            setInput("");
            setShowingAnswer(false);
            chooseNextWord();
        } else {
            if (cardsState !== "idle") {
                setPendingEnter(true);
                return;
            }
            setShowingAnswer(true);
            processAnswer(input === currentWord);
        }
    }, [
        showingAnswer,
        setInput,
        setShowingAnswer,
        cardsState,
        setPendingEnter,
        setShowingAnswer,
    ]);

    return (
        <Page>
            <div class="Main">
                <div class={showingAnswer ? "" : "hidden"}>
                    {cardsState === "idle" || cardsState === "saving" ? (
                        <CheckedAnswer current={input} target={currentWord} />
                    ) : (
                        "..."
                    )}
                </div>
                <WordInput
                    id="ip"
                    onInput={(e) => {
                        if (
                            "value" in e.target &&
                            typeof e.target.value === "string"
                        )
                            setInput(e.target.value);
                    }}
                    value={input}
                    readOnly={
                        showingAnswer ||
                        ["initial", "error", "loading"].includes(cardsState)
                    }
                />
                <button onClick={onEnterButtonClick}>Enter</button>
                {cardsState === "initial" && "..."}
                {cardsState === "error" && "x"}
                {cardsState === "loading" && "<-"}
                {cardsState === "idle" && "v"}
                {cardsState === "saving" && "->"}
                <br />
                {cardsState === "idle" || cardsState === "saving" ? (
                    <Defs word={currentWord} />
                ) : (
                    "..."
                )}
            </div>
        </Page>
    );
};
