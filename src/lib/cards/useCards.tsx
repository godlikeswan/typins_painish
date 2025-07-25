import { WordStats } from "./cards";
import wordsDataRaw from "../../../words_data.json?raw";
import { WordsDataByLang } from "../../../tools/wordDataTypes";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { chooseWordIndex, processAnswerResult, toggleDef } from "./sra";
import { useGoogle } from "../saveProgress/google/context";
import { loadGoogleFile, updateGoogleFile } from "../saveProgress/google/api";
import { createContext } from "preact";
import { useNavigate } from "react-router";

export const wordsData: WordsDataByLang = JSON.parse(wordsDataRaw);
export const WordsDataContext = createContext(wordsData);

const initCards = () => {
    const cards: WordStats[] = [];
    wordsData["es"].wordsSortedByFreq
        // .filter((_, i) => i < 3)
        .forEach((word) => {
            cards.push({ word, astat: 0, showNext: 0, hiddenDefs: [] });
        });
    return cards;
};

export type CardsState =
    | "initial"
    | "loading"
    | "idle"
    | "saving"
    | "error"
    | "local";

export const useCards = () => {
    const cardsRef = useRef(null);
    const { googleState } = useGoogle();
    const navigate = useNavigate();

    const [googleFileId, setGoogleFileId] = useState(null);
    const [wordIndex, setWordIndex] = useState<number>(0);
    const [cardsState, setCardsState] = useState<CardsState>("initial");

    const chooseNextWord = useCallback(() => {
        if (!cardsRef.current) navigate("/");
        setWordIndex(chooseWordIndex(cardsRef.current));
    }, [setWordIndex, navigate]);

    useEffect(() => {
        if (googleState !== "ready" || !gapi || !google) {
            navigate("/");
            return;
        }
        if (cardsState === "initial") {
            const loadCardsFunc = async () => {
                setCardsState("loading");
                const res = await loadGoogleFile(initCards);
                cardsRef.current = res.data;
                setGoogleFileId(res.googleFileId);
                chooseNextWord();
                setCardsState("idle");
            };
            loadCardsFunc();
            return;
        }
    }, [
        googleState,
        navigate,
        cardsState,
        setCardsState,
        setGoogleFileId,
        chooseNextWord,
    ]);

    const cards = cardsRef.current;
    const currentCard = cards && cards[wordIndex];
    const currentWord = cards && cards[wordIndex] ? cards[wordIndex].word : "";

    const processAnswer = useCallback(
        (isCorrect: boolean) => {
            const changedIndex = processAnswerResult(
                isCorrect,
                wordIndex,
                cardsRef.current,
            );
            const save = async () => {
                setCardsState("saving");
                await updateGoogleFile(cardsRef.current, googleFileId);
                setCardsState("idle");
            };
            save();
            setWordIndex(changedIndex);
        },
        [currentWord, wordIndex, setCardsState, googleFileId, setWordIndex],
    );

    const handleDefToggled = useCallback(
        (defIndex: number) => {
            toggleDef(defIndex, wordIndex, cardsRef.current);
        },
        [wordIndex],
    );

    return {
        cards,
        cardsState,
        currentWord,
        currentCard,
        processAnswer,
        chooseNextWord,
        handleDefToggled,
    };
};
