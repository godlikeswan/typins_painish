import { Page } from "../../components/Page";

import "./style.css";
import { useGoogle } from "../../lib/saveProgress/google/context";

export const Start = () => {
    const { enable, googleState } = useGoogle();
    return (
        <Page>
            <h1>Typins painish</h1>
            <p>Here you can learn Spanish vocabulary by typing words.</p>
            <p>
                To save your progress you need to sign in to your google
                account.
            </p>
            <button onClick={enable} disabled={googleState === "loading"}>
                Sign in
            </button>
        </Page>
    );
};
