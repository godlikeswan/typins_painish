export type Word = string;

export type Gloss = string;

export type Sense = {
    glosses: Gloss[];
};

export type Pos = string;

export type Def = {
    pos: Pos;
    senses: Sense[];
};

export type WordsData = {
    wordsSortedByFreq: Word[];
    wordsDefs: Record<Word, Def[]>;
};

export type WordsDataByLang = {
    [key in string]: WordsData;
};
