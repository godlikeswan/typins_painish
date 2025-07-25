import { useContext, useReducer } from "preact/hooks";
import { Def, Gloss, Word } from "../../tools/wordDataTypes";
import { WordsDataContext } from "../lib/cards/cardsContext";

import "./Def.css";
import { WordStats } from "../lib/cards/cards";

const Sence = (props: { glosses: Gloss[] }) => {
    const { glosses } = props;
    return glosses.join(", ") + "; ";
};

const Definition = (props: {
    def: Def;
    hidden: boolean;
    onClick: () => void;
}) => {
    const { def, onClick, hidden } = props;
    const { pos, senses } = def;

    return (
        <li onClick={onClick}>
            <span class={hidden ? "hidden" : ""}>
                {pos}:{" "}
                {senses.map((s) => (
                    <Sence glosses={s.glosses} />
                ))}
            </span>
        </li>
    );
};

export const Defs = (props: {
    word: Word;
    card: WordStats;
    handleDefToggled: (i: number) => void;
}) => {
    const { word, card, handleDefToggled } = props;
    const wordsData = useContext(WordsDataContext);
    const [, forceUpdate] = useReducer((s) => !s, false);

    if (!word) return "...";

    return (
        <div>
            <ul>
                {wordsData.wordsDefs[word].map((d, i) => (
                    <Definition
                        hidden={card.hiddenDefs.includes(i)}
                        def={d}
                        onClick={() => {
                            handleDefToggled(i);
                            forceUpdate(false);
                        }}
                    />
                ))}
            </ul>
        </div>
    );
};
