import { useContext } from "preact/hooks";
import { Def, Gloss, Word } from "../../tools/wordDataTypes";
import { WordsDataContext } from "../lib/cards/cardsContext";

const Sence = (props: { glosses: Gloss[] }) => {
    const { glosses } = props;
    return glosses.join(", ") + "; ";
};

const Definition = (props: { def: Def }) => {
    const { def } = props;
    const { pos, senses } = def;

    return (
        <li>
            {pos}:{" "}
            {senses.map((s) => (
                <Sence glosses={s.glosses} />
            ))}
        </li>
    );
};

export const Defs = (props: { word: Word }) => {
    const { word } = props;
    const wordsData = useContext(WordsDataContext);

    if (!word) return "...";

    return (
        <div>
            <ul>
                {wordsData.wordsDefs[word].map((d) => (
                    <Definition def={d} />
                ))}
            </ul>
        </div>
    );
};
