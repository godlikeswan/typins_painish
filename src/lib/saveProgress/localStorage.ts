import { WordStats } from "../cards/cards";

export const gpipip = () => {
    if (navigator.storage && navigator.storage.persist) {
        navigator.storage.persist().then((persistent) => {
            if (persistent) {
                console.log(
                    "Storage will not be cleared except by explicit user action",
                );
            } else {
                console.log(
                    "Storage may be cleared by the UA under storage pressure.",
                );
            }
        });
    }
};

export const saveCards = (cards: WordStats[]) => {
    localStorage.setItem("cards", JSON.stringify(cards));
};

export const loadCards = () => {
    // if (!localStorage.getItem("cards"))
    // initCards();
    const cards: WordStats[] = JSON.parse(localStorage.getItem("cards"));
    return cards;
    // return initCards();
};
