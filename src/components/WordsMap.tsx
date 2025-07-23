import { useCallback, useEffect, useRef } from "preact/hooks";
import { WordStats } from "../lib/cards/cards";

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

    const render = useCallback(() => {
        ref.current.width = Math.floor(ref.current.clientWidth / SCALE);
        ref.current.height = Math.floor(10000 / ref.current.width / SCALE);
        const w = ref.current.width;
        const h = ref.current.height;
        const context = ref.current.getContext("2d");
        context.fillStyle = "gray";
        context.fillRect(0, 0, w, h);
        const d = Date.now();
        if (!cards) return;
        cards.forEach((c, i) => {
            context.fillStyle = heatMapColorforValue(
                (c.showNext - d) / 1000 / 60 / 60,
            );
            if (d > c.showNext) context.fillStyle = "purple";
            if (c.word === currentWord) context.fillStyle = "white";
            const x = Math.floor(i % w);
            const y = Math.floor(i / w);
            context.fillRect(x, y, 1, 1);
        });
    }, [cards, currentWord]);

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

    return (
        <canvas
            height={1}
            style={{
                display: "block",
                imageRendering: "pixelated",
                width: "100%",
            }}
            ref={ref}
        >
            No js =(
        </canvas>
    );
};
