import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { WordStats } from "../lib/cards/cards";
import { wordsData } from "../lib/cards/useCards";

function heatMapColorforValue(value: number) {
    var h = Math.floor((1.0 - value) * 240);
    return "hsl(" + h + ", 100%, 50%)";
}

const SCALE = 4;

export const WordsMap = (props: {
    cards: WordStats[];
    currentWord: string;
}) => {
    const { cards, currentWord } = props;
    const ref = useRef<HTMLCanvasElement>(null);
    const [hidden, setHidden] = useState(true);

    const render = useCallback(() => {
        const words = wordsData["es"].wordsSortedByFreq;
        ref.current.width = Math.floor(ref.current.clientWidth / SCALE);
        ref.current.height = Math.ceil(words.length / ref.current.width);
        const w = ref.current.width;
        const h = ref.current.height;
        const context = ref.current.getContext("2d");
        context.fillStyle = "#00000000";
        context.fillRect(0, 0, w, h);
        if (!cards) return;
        if (hidden) return;
        const d = Date.now();
        cards.forEach((c, i) => {
            context.fillStyle = heatMapColorforValue(
                Math.min(
                    Math.log2(Math.max((c.showNext - d) / 1000 / 60, 1)),
                    36,
                ) / 36,
            );
            if (d > c.showNext) context.fillStyle = "purple";
            if (c.showNext === 0) context.fillStyle = "gray";
            if (c.word === currentWord) context.fillStyle = "white";
            const x = Math.floor(i % w);
            const y = Math.floor(i / w);
            context.fillRect(x, y, 1, 1);
        });
    }, [cards, currentWord, hidden]);

    useEffect(() => {
        render();
    }, [render]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(render);
        const el = ref.current;
        resizeObserver.observe(el);
        return () => {
            resizeObserver.unobserve(el);
        };
    }, [render]);

    const l = useCallback(() => {
        setHidden((h) => !h);
    }, [setHidden]);

    return (
        <canvas
            height={1}
            style={{
                display: "block",
                imageRendering: "pixelated",
                width: "100%",
            }}
            ref={ref}
            onClick={l}
        >
            No js =(
        </canvas>
    );
};
