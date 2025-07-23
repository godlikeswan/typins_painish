import { WordStats } from "./cards";
import wordsDataRaw from "../../../cards.json?raw";
import { WordsData } from "../../../tools/wordDataTypes";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { chooseWordIndex, processAnswerResult } from "./sra";
import { useGoogle } from "../saveProgress/google/context";
import { loadGoogleFile, updateGoogleFile } from "../saveProgress/google/api";
import { createContext } from "preact";
import { useNavigate } from "react-router";

export const wordsData: WordsData = JSON.parse(wordsDataRaw);
export const WordsDataContext = createContext(wordsData);

const initCards = () => {
    const cards: WordStats[] = [];
    wordsData.wordsSortedByFreq
        .filter((_, i) => i < 10)
        .forEach((word) => {
            cards.push({ word, astat: 0, showNext: 0 });
        });
    return cards;
};

type CardsState = "initial" | "loading" | "idle" | "saving" | "error" | "local";

export const useCards = () => {
    const cardsRef = useRef(null);
    const [googleFileId, setGoogleFileId] = useState(null);
    const navigate = useNavigate();
    const [wordIndex, setWordIndex] = useState<number>(0);
    const [cardsState, setCardsState] = useState<CardsState>("initial");
    const { googleState } = useGoogle();

    const chooseNextWord = useCallback(() => {
        const newIndex = chooseWordIndex(cardsRef.current);
        setWordIndex(chooseWordIndex(cardsRef.current));
    }, [setWordIndex]);

    useEffect(() => {
        if (googleState !== "ready") navigate("/");
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
    }, [googleState, navigate, cardsState, setCardsState, setGoogleFileId]);

    useEffect(() => {
        const listener = () => {
            const save = async () => {
                const savingWord = currentWord;
                setCardsState("saving");
                await updateGoogleFile(cardsRef.current, googleFileId);
                setCardsState("idle");
            };
            if (document.hidden) save();
        };
        document.addEventListener("visibilitychange", listener);
        return () => {
            document.removeEventListener("visibilitychange", listener);
        };
    });

    const cards = cardsRef.current;
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
        [currentWord, wordIndex, setCardsState, googleFileId],
    );

    return {
        cardsState,
        currentWord,
        processAnswer,
        chooseNextWord,
    };
};
