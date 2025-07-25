import { WordStats } from "./cards";

export function chooseWordIndex(cards: WordStats[]) {
    const ts = Date.now();
    const len = cards.length;
    for (let i = 0; i < len; ++i) {
        const { showNext } = cards[i];
        if (showNext < ts) return i;
    }
    return 0;
}

export function updateCard(isCorrect: boolean, card: WordStats) {
    const ts = Date.now();
    if (isCorrect) {
        ++card.astat;
    } else {
        card.astat = Math.floor(card.astat / 2);
    }
    card.showNext = ts + 1000 * 60 * 2 ** card.astat;
}

export function processAnswerResult(
    isCorrect: boolean,
    wordIndex: number,
    cards: WordStats[],
) {
    const card = cards[wordIndex];
    updateCard(isCorrect, card);
    const len = cards.length;
    while (
        wordIndex < len - 1 &&
        cards[wordIndex + 1].showNext !== 0 &&
        cards[wordIndex + 1].showNext < card.showNext
    ) {
        ++wordIndex;
        cards[wordIndex - 1] = cards[wordIndex];
    }
    while (wordIndex > 0 && cards[wordIndex - 1].showNext > card.showNext) {
        cards[wordIndex] = cards[wordIndex - 1];
        --wordIndex;
    }
    cards[wordIndex] = card;
    return wordIndex;
}

export function toggleDef(
    defIndex: number,
    wordIndex: number,
    cards: WordStats[],
) {
    const card = cards[wordIndex];
    if (card.hiddenDefs.includes(defIndex))
        card.hiddenDefs = card.hiddenDefs.filter((i) => i !== defIndex);
    else card.hiddenDefs.push(defIndex);
}
