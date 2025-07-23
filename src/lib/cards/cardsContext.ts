import { createContext } from "preact";
import { WordStats } from "./cards";
import wordsDataRaw from "../../../cards.json?raw";
import { WordsData } from "../../../tools/wordDataTypes";

const wordsData: WordsData = JSON.parse(wordsDataRaw);

export const saveCards = (cards: WordStats[]) => {
    // localStorage.setItem("cards", JSON.stringify(cards));
};

// const initCards = () => {
//     const cards: WordStats[] = [];
//     wordsData.wordsSortedByFreq
//         .filter((_, i) => i < 10)
//         .forEach((word) => {
//             cards.push({ word, astat: 0, showNext: 0 });
//         });
//     console.log("cards created");
//     console.log(cards);
//     saveCards(cards);
// };

// const loadCards = () => {
//     if (!localStorage.getItem("cards")) initCards();
//     return JSON.parse(localStorage.getItem("cards"));
// };

export const WordsDataContext = createContext(wordsData);
// export const CardsContext = createContext(loadCards());
