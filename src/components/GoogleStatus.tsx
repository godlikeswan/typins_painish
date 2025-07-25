import { CardsState } from "../lib/cards/useCards";
import { Downloading, Err, Okay, Uploading, Waining } from "./glyphs";
import "./GoogleStatus.css";

export const GoogleStatus = (props: { cardsState: CardsState }) => {
    const { cardsState } = props;
    return (
        <div class="GoogleStatus">
            {cardsState === "initial" && <Waining />}
            {cardsState === "error" && <Err />}
            {cardsState === "loading" && <Downloading />}
            {cardsState === "idle" && <Okay />}
            {cardsState === "saving" && <Uploading />}
            <div class="GoogleIcon">G</div>
        </div>
    );
};
