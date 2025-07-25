import { createContext } from "preact";
import { WordStats } from "./cards";
import wordsDataRaw from "../../../words_data.json?raw";
import { WordsData, WordsDataByLang } from "../../../tools/wordDataTypes";

const wordsData: WordsDataByLang = JSON.parse(wordsDataRaw);

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

export const WordsDataContext = createContext(wordsData["es"]);
// export const CardsContext = createContext(loadCards());
