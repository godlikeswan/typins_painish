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
import { WordsMap } from "../../components/WordsMap";
import { GoogleStatus } from "../../components/GoogleStatus";

export const Main = () => {
    const {
        currentWord,
        currentCard,
        processAnswer,
        cardsState,
        chooseNextWord,
        cards,
        handleDefToggled,
    } = useCards();
    const { googleState } = useGoogle();

    const navigate = useNavigate();

    const [showingAnswer, setShowingAnswer] = useState(false);
    const [input, setInput] = useState("");
    const [pendingEnter, setPendingEnter] = useState(false);
    const [numberOfWords, setNumberOfWords] = useState(0);

    useEffect(() => {
        if (googleState !== "ready") navigate("/");
    }, [googleState, navigate]);

    useEffect(() => {
        if (!pendingEnter || cardsState !== "idle" || showingAnswer) return;
        setShowingAnswer(true);
        processAnswer(input === currentWord);
        setNumberOfWords((n) => n + 1);
        setPendingEnter(false);
    }, [pendingEnter, cardsState, showingAnswer]);

    const onEnterButtonClick = useCallback(() => {
        if (showingAnswer) {
            setInput("");
            setShowingAnswer(false);
            chooseNextWord();
            return;
        }
        if (cardsState !== "idle") {
            setPendingEnter(true);
            return;
        }
        processAnswer(input === currentWord);
        setNumberOfWords((n) => n + 1);
        setShowingAnswer(true);
    }, [
        input,
        currentWord,
        showingAnswer,
        setInput,
        setShowingAnswer,
        chooseNextWord,
        cardsState,
        setPendingEnter,
        processAnswer,
        setShowingAnswer,
    ]);

    useEffect(() => {
        const l: KeyboardEventHandler<HTMLElement> = (e) => {
            if (e.code === "Enter") {
                onEnterButtonClick();
            }
        };
        document.addEventListener("keydown", l);
        return () => {
            document.removeEventListener("keydown", l);
        };
    }, [onEnterButtonClick]);

    return (
        <>
            <WordsMap cards={cards} currentWord={currentWord} />
            <Page>
                <div class="TopBar">
                    Words: {numberOfWords}
                    <GoogleStatus cardsState={cardsState} />
                </div>
                <div class="Main">
                    <div class="InputField">
                        <CheckedAnswer
                            current={input}
                            target={currentWord}
                            hidden={!showingAnswer}
                        />
                        <br />
                        <WordInput
                            id="ip"
                            onInput={(e) => {
                                if (
                                    "value" in e.target &&
                                    typeof e.target.value === "string"
                                )
                                    setInput(e.target.value);
                            }}
                            isGood={showingAnswer && input === currentWord}
                            isBad={showingAnswer && input !== currentWord}
                            value={input}
                            readOnly={
                                showingAnswer ||
                                ["initial", "error", "loading"].includes(
                                    cardsState,
                                )
                            }
                        />
                        <button onClick={onEnterButtonClick}>Enter</button>
                    </div>
                    {cardsState === "idle" || cardsState === "saving" ? (
                        <Defs
                            word={currentWord}
                            card={currentCard}
                            handleDefToggled={handleDefToggled}
                        />
                    ) : (
                        "..."
                    )}
                </div>
            </Page>
        </>
    );
};
