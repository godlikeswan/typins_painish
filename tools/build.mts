import { createReadStream, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";
import * as path from "node:path";
// comment before run; uncomment for types
// import { Def, Word, WordsDataByLang } from "./wordDataTypes";

const langs = [
    "es",
    // "ru"
];
const rawDataDir = path.join(import.meta.dirname, "..", "data_raw");
// Expected
// /data_raw/es_freq.txt , /data_raw/es_dict.jsonl
// /data_raw/ru_freq.txt , /data_raw/ru_dict.jsonl
// to exist
const outFile = path.join(import.meta.dirname, "..", "words_data.json");

async function processLineByLine(path: string, cb: (line: string) => void) {
    const fileStream = createReadStream(path);

    const rl = createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    for await (const line of rl) {
        cb(line);
    }
}

async function processLang(lang: (typeof langs)[0]) {
    const cardsSet = new Set<string>();
    await processLineByLine(path.join(rawDataDir, `${lang}_freq.txt`), (p) => {
        const [word, _] = p.split(" ");
        cardsSet.add(word.toLowerCase());
    });

    console.log("word frequencies processed");

    const rawToNes = (data: Def) => {
        const { pos, senses: sensesRaw } = data;
        const senses = sensesRaw.map(({ glosses }) => ({
            glosses,
        }));

        return { pos, senses };
    };

    const dict = new Map<Word, Def[]>();
    await processLineByLine(
        path.join(rawDataDir, `${lang}_dict.jsonl`),
        (str) => {
            const json = JSON.parse(str);
            const key = json.word.toLowerCase();
            // Uncomment to pull all the words
            // if (!cardsSet.has(key)) cardsSet.add(key);
            if (dict.has(key)) {
                const definitions = dict.get(key);
                definitions.push(rawToNes(json));
                dict.set(key, definitions);
            } else {
                dict.set(key, [rawToNes(json)]);
            }
        },
    );
    console.log("dict parsed");

    const wordsSortedByFreq = [];
    const wordsDefs: Record<Word, Def[]> = {};

    let i = 0;
    for (const w of cardsSet) {
        if (dict.has(w) && i++ < 10000) {
            wordsSortedByFreq.push(w);
            wordsDefs[w] = dict.get(w);
        }
    }
    return { wordsSortedByFreq, wordsDefs };
}

// Promise.all(
//     langs.map(
//         (lang) =>
//             new Promise((resolve) => {
//                 processLang(lang).then((v) => {
//                     resolve([lang, v]);
//                 });
//             }),
//     ),
// );

const wordsDataByLangs: WordsDataByLang = Object.fromEntries(
    // Promise.all(langs.map(async (l) => [l, await processLang(l)])),
    await Promise.all(
        langs.map(
            (lang) =>
                new Promise((resolve) => {
                    processLang(lang).then((v) => {
                        resolve([lang, v]);
                    });
                }),
        ),
    ),
);

writeFileSync(outFile, JSON.stringify(wordsDataByLangs));
console.log("file written");
